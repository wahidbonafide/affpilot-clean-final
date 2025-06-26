import { useState } from 'react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('blog');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!keyword) return alert('Please enter a keyword');
    setLoading(true);
    setOutput('');

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, type }),
    });

    const data = await res.json();
    setOutput(data.text);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">AffPilot-Lite: AI Content Generator</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter a keyword"
          className="w-full p-2 border border-gray-300 rounded"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="blog">Blog Post</option>
          <option value="review">Product Review</option>
          <option value="howto">How-To Guide</option>
        </select>
        <button
          onClick={handleGenerate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {output && (
          <textarea
            className="w-full h-96 p-2 border border-gray-300 rounded"
            value={output}
            readOnly
          />
        )}
      </div>
    </div>
  );
}
