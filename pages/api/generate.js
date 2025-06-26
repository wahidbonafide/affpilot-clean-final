export default async function handler(req, res) {
  const { keyword, type } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  const promptMap = {
    blog: `Write a detailed blog post about "${keyword}". Include headings, tips, and a conclusion.`,
    review: `Write a product review article for "${keyword}". Include 5 product summaries with pros and cons.`,
    howto: `Write a how-to guide titled "${keyword}". Use step-by-step instructions with tips.`,
  };

  const prompt = promptMap[type] || promptMap.blog;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-pro',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const json = await response.json();

    const text = json.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(200).json({ text: "⚠️ API returned no content. Try another model or check your key." });
    }

    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ text: `🚫 Error: ${error.message}` });
  }
}
