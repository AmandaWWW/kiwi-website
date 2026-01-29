export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { messages } = req.body;
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = process.env.BAILIAN_APP_ID;

    if (!apiKey || !appId) {
        console.error("Missing Config:", { apiKey: !!apiKey, appId: !!appId });
        return res.status(500).json({ error: 'Server Config Error: Missing API Key or App ID' });
    }

    try {
        // 1. Prepare Prompt (Extract last message)
        const lastMessage = messages[messages.length - 1].content;

        // 2. Call Bailian App API
        const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: { prompt: lastMessage },
                parameters: { incremental_output: true },
                debug: {}
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Bailian API Error:", errorText);
            return res.status(response.status).json({ error: 'Bailian Provider Error' });
        }

        // 3. Stream & Adapt Response
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) continue;

                const dataStr = trimmed.slice(5).trim();
                if (!dataStr) continue;

                try {
                    const json = JSON.parse(dataStr);
                    // ADAPTER: Bailian -> OpenAI Format
                    const content = json.output?.text || '';

                    if (content) {
                        const openAIPayload = {
                            choices: [{ delta: { content: content } }]
                        };
                        res.write(`data: ${JSON.stringify(openAIPayload)}\n\n`);
                    }

                    if (json.output?.finish_reason === 'stop') {
                        res.write('data: [DONE]\n\n');
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }
        res.end();

    } catch (error) {
        console.error("Stream Error:", error);
        res.status(500).json({ error: 'Internal Stream Error' });
    }
}