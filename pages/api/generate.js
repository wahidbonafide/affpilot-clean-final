export default async function handler(req, res) {
  const { keyword, type } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;   // ← uses your new key

  const promptMap = {
    blog:  `Write a detailed blog post about "${keyword}". Include headings, tips, and a conclusion.`,
    review:`Write a product review article for "${keyword}". Include 5 product summaries with pros and cons.`,
    howto:`Write a how-to guide titled "${keyword}". Use step-by-step instructions with tips.`,
  };
  const prompt = promptMap[type] || promptMap.blog;

  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',   // ← OpenAI endpoint
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',       // or 'gpt-4o' if available
          messages: [
            { role: 'system', content: 'You are a helpful writing assistant.' },
            { role: 'user',   content: prompt }
          ],
          max_tokens: 1500
        }),
      }
    );

    const json = await response.json();
    const text = json.choices?.[0]?.message?.content;

    if (!text) {
      return res
        .status(200)
        .json({ text: '⚠️ No content returned. Check your API key or model name.' });
    }

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ text: `🚫 Error: ${err.message}` });
  }
}

