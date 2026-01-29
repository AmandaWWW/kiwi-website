export default async function handler(req, res) {
    // 1. Security: Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Data Validation
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid message format' });
    }

    // 3. API Key Security (The "Bodyguard")
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
        console.error('Error: ZHIPU_API_KEY is missing in Vercel Environment Variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const knowledgeId = process.env.ZHIPU_KNOWLEDGE_ID;

        // 1. Construct the request payload dynamically
        const requestPayload = {
            model: "glm-4.7-flash", // STRICTLY using user-defined model name
            messages: messages,
            stream: true,
            temperature: 0.7,
            top_p: 0.7
        };

        // 2. Inject Knowledge Base Tool if ID is available in Env
        if (knowledgeId) {
            console.log("RAG Enabled. Using Knowledge ID:", knowledgeId);
            requestPayload.tools = [{
                type: "retrieval",
                retrieval: {
                    "knowledge_id": knowledgeId,
                    "prompt_template": "请参考以下文档内容：\n{{knowledge}}\n\n请结合文档内容和System Prompt的人设回答用户：\n{{question}}"
                }
            }];
        }

        // 3. Send request to Zhipu
        const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestPayload)
        });

        // 4. Handle Zhipu API errors (Log detailed error if 400/500)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Zhipu API Error:", errorData);
            // Return specific error if model name is invalid
            if (errorData.error?.code === "1214" || response.status === 400) {
                return res.status(400).json({ error: 'Model name invalid or bad request' });
            }
            return res.status(502).json({ error: 'Failed to communicate with AI provider' });
        }

        // 5. Setup Streaming Response (Standard Vercel/Node stream)
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
                if (!trimmed || !trimmed.startsWith('data: ')) continue;
                const dataStr = trimmed.replace('data: ', '');
                if (dataStr === '[DONE]') continue;

                try {
                    const json = JSON.parse(dataStr);
                    const content = json.choices[0]?.delta?.content || '';
                    if (content) res.write(content);
                } catch (e) { }
            }
        }
        res.end();

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}