export default async function handler(req, res) {
    // 1. Setup & Config Check
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { messages } = req.body;
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = process.env.BAILIAN_APP_ID;

    if (!apiKey || !appId) {
        console.error("❌ Configuration Missing: API Key or App ID not set.");
        return res.status(500).json({ error: 'Server Config Error' });
    }

    try {
        console.log(`🔌 Connecting to Bailian App: ${appId}`);
        const lastMessage = messages[messages.length - 1].content;

        // 2. Request to Alibaba
        const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-DashScope-SSE': 'enable' // Explicitly enable SSE
            },
            body: JSON.stringify({
                input: { prompt: lastMessage },
                parameters: { incremental_output: true },
                debug: {}
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Alibaba API Error:", response.status, errorText);
            return res.status(response.status).json({ error: `Provider Error: ${errorText}` });
        }

        // 3. Stream Setup
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        console.log("🌊 Stream started...");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Log raw chunk for debugging (optional, remove in production if too noisy)
            // console.log("Raw Chunk:", chunk);

            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep incomplete line

            for (const line of lines) {
                const trimmed = line.trim();
                // Bailian lines usually start with "data:"
                if (!trimmed || !trimmed.startsWith('data:')) continue;

                const dataStr = trimmed.slice(5).trim();
                if (!dataStr) continue;

                try {
                    const json = JSON.parse(dataStr);

                    // Logic: Bailian returns text in output.text
                    const content = json.output?.text || '';

                    // Only write if there is content
                    if (content) {
                        const openAIPayload = {
                            choices: [{ delta: { content: content } }]
                        };
                        res.write(`data: ${JSON.stringify(openAIPayload)}\n\n`);
                    }

                    // Handle completion
                    if (json.output?.finish_reason === 'stop') {
                        console.log("✅ Stream finished normally");
                        res.write('data: [DONE]\n\n');
                    }
                } catch (e) {
                    console.warn("⚠️ JSON Parse Error on line:", trimmed, e);
                    // Do not break the loop, just skip this line
                }
            }
        }
        res.end();

    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        res.status(500).json({ error: error.message });
    }
}