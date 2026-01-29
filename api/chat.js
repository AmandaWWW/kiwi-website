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

    // 3.1. Knowledge Base ID for RAG (Retrieval Augmented Generation)
    const knowledgeId = process.env.ZHIPU_KNOWLEDGE_ID;
    if (knowledgeId) {
        console.log('Knowledge Base ID found, RAG enabled:', knowledgeId);
    } else {
        console.warn('ZHIPU_KNOWLEDGE_ID not set - proceeding without RAG');
    }

    try {
        // 4. Build request body with conditional RAG support
        const requestBody = {
            model: "glm-4-plus", // Recommended model for RAG
            messages: messages,
            stream: true, // ENABLE STREAMING
            temperature: 0.5, // Lower temperature for more accurate retrieval
            top_p: 0.7,
            // Only add tools if Knowledge ID is present
            ...(knowledgeId && {
                tools: [{
                    type: "retrieval",
                    retrieval: {
                        "knowledge_id": knowledgeId,
                        "prompt_template": "请根据以下参考文档回答问题：\n{{knowledge}}\n\n如果文档中没有答案，请根据你的常识或System Prompt回答。\n用户问题：{{question}}"
                    }
                }]
            })
        };

        // 5. Forward request to Zhipu AI with streaming enabled
        const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        // 6. Handle Zhipu API errors
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Zhipu API Error:", errorData);
            return res.status(502).json({ error: 'Failed to communicate with AI provider' });
        }

        // 7. Prepare response headers for streaming
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
        });

        // 8. Create a reader to process the upstream stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // 9. Process complete SSE messages
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep the last incomplete line in buffer

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data: ')) continue;

                const dataStr = trimmed.replace('data: ', '');
                if (dataStr === '[DONE]') continue;

                try {
                    const json = JSON.parse(dataStr);
                    const content = json.choices[0]?.delta?.content || '';
                    if (content) {
                        res.write(content); // Send RAW TEXT to frontend
                    }
                } catch (e) {
                    // Ignore parse errors for partial chunks
                }
            }
        }

        res.end();

    } catch (error) {
        console.error("Stream Error:", error);
        if (!res.headersSent) {
            res.writeHead(500, {
                'Content-Type': 'text/plain; charset=utf-8'
            });
        }
        res.write("\n[System Error: Connection failed]");
        res.end();
    }
}