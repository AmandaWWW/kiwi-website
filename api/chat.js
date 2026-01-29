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
        // 4. Forward request to Zhipu AI
        const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "glm-4-flash", // Cost-effective model
                messages: messages,
                stream: false,
                temperature: 0.7,
                top_p: 0.7
            })
        });

        const data = await response.json();

        // 5. Handle Zhipu API errors
        if (!response.ok) {
            console.error("Zhipu API Error:", data);
            return res.status(502).json({ error: 'Failed to communicate with AI provider' });
        }

        // 6. Return the clean result
        const aiMessage = data.choices[0].message.content;
        return res.status(200).json({ result: aiMessage });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}