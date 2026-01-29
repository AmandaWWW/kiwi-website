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

    // 3. API Key Security (Prefer DashScope, fallback to Zhipu)
    const apiKey = process.env.DASHSCOPE_API_KEY || process.env.ZHIPU_API_KEY;
    if (!apiKey) {
        console.error('Error: DASHSCOPE_API_KEY and ZHIPU_API_KEY are both missing in Vercel Environment Variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // 1. Construct Payload (Standard OpenAI format for Alibaba)
        const requestPayload = {
            model: "deepseek-v3",
            messages: messages,
            stream: true,
            temperature: 0.7
            // Note: RAG/Tools temporarily disabled for provider switch
        };

        console.log("Connecting to Alibaba Cloud Deepseek...");

        // 2. Send Request to Alibaba Endpoint
        const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestPayload)
        });

        // 3. Handle Alibaba API errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Alibaba API Error:", errorData);
            return res.status(response.status).json({ error: errorData.message || 'Provider Error' });
        }

        // 4. Setup Streaming Response (Standard SSE)
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