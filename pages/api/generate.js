// pages/api/generate.js

export default async function handler(req, res) {
  // 1. Pull your OpenAI key from the environment
  const apiKey = process.env.OPENAI_API_KEY;

  // 2. Read the user’s input
  const { keyword, type } = req.body;

  // 3. Build the prompt based on the selected type
  const promptMap = {
    blog:  `Write a detailed blog post about "${keyword}". Include headings, tips, and a conclusion.`,
    review:`Write a product review article for "${keyword}". Include 5 product summaries with pros and cons.`,
    howto:`Write a how-to guide titled "${keyword}". Use step-by-step instructions with tips.`,
  };
  const prompt = promptMap[type] || promptMap.blog;

  try {
    // 4. Call the OpenAI API
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',   // ← OpenAI endpoint
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',       // or 'gpt-4o' if you have access
          messages: [
            { role: 'system', content: 'You are a helpful writing assistant.' },
            { role: 'user',   content: prompt }
          ],
          max_tokens: 1500
        }),
      }
    );

    // 5. Parse the JSON response
    const json = await response.json();

    // 6. Debug: log the entire API response
    console.log("🔍 OpenAI full response:", JSON.stringify(json));

    // 7. Extract the generated text
    const text = json.choices?.[0]?.message?.content;

    // 8. If no text, return the full JSON so we can see what happened
    if (!text) {
      return res.status(200).json({
        text: `⚠️ No content returned. Full API response:\n${JSON.stringify(json, null, 2)}`
      });
    }

    // 9. Otherwise return the generated text
    res.status(200).json({ text });

  } catch (err) {
    // 10. If the fetch itself failed, return the error message
    res.status(500).json({ text: `🚫 Error: ${err.message}` });
  }
}

