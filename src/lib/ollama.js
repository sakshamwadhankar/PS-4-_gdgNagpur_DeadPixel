export async function generateOllamaResponse(prompt) {
  const url = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
  const model = process.env.OLLAMA_MODEL || 'llama3';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      console.error(`Ollama Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data.response;
  } catch (err) {
    console.error('Ollama connection failed:', err);
    return null;
  }
}

export async function categorizeIssue(text) {
  const categories = [
    'Roads & Transport', 'Water Supply', 'Sanitation', 
    'Street Lighting', 'Parks & Recreation', 'Drainage', 
    'Public Safety', 'Education', 'Healthcare', 'Other'
  ];

  const prompt = `
You are a civic issue classifier. Read the issue below and classify it into exactly one of the following categories:
[${categories.join(', ')}]

Issue: "${text}"

Reply with JUST the category name. Do not include any other text, explanation, or quotes.
`;

  const response = await generateOllamaResponse(prompt);
  if (!response) return 'Other';

  const cleaned = response.trim();
  
  // Ensure it's a valid category
  const match = categories.find(c => cleaned.includes(c));
  return match || 'Other';
}

export async function scoreSeverity(text) {
  const prompt = `
You are a civic infrastructure expert evaluating the severity of local issues on a scale from 1 to 5.
1 = Minor (e.g., broken park bench)
2 = Low (e.g., small pothole in residential area)
3 = Moderate (e.g., streetlights out on a minor road)
4 = High (e.g., no garbage collection for weeks, large road cave-in)
5 = Critical (e.g., no water supply, dangerous health hazard, life-threatening)

Issue: "${text}"

Reply with JUST the number (1, 2, 3, 4, or 5). Do not include any other text.
`;

  const response = await generateOllamaResponse(prompt);
  if (!response) return 3; // Default to moderate

  const cleaned = response.trim();
  const score = parseInt(cleaned.replace(/\D/g, ''), 10);
  
  if (score >= 1 && score <= 5) return score;
  return 3;
}

export async function detectDuplicate(newText, existingIssues) {
  if (!existingIssues || existingIssues.length === 0) return null;

  const issueList = existingIssues.map(i => `[ID: ${i.id}] ${i.text}`).join('\n');

  const prompt = `
You are an AI deduplication assistant. Your job is to check if a new civic issue report is describing the EXACT SAME real-world problem as any of the existing open issues in the database.

Existing Issues:
${issueList}

New Issue: "${newText}"

If the new issue is extremely similar (describing the same problem at the same location) to one of the existing issues (at least 85% confidence), reply in this JSON format:
{ "duplicate": true, "match_id": "<ID_OF_THE_MATCH>" }

If there is no confident match, reply in this JSON format:
{ "duplicate": false, "match_id": null }

Reply ONLY with valid JSON. Do not include markdown code blocks (\`\`\`) or any other text.
`;

  const response = await generateOllamaResponse(prompt);
  if (!response) return null;

  try {
    const jsonStr = response.trim().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);
    
    if (data.duplicate && data.match_id) {
      return data.match_id;
    }
  } catch (err) {
    console.error('Failed to parse Ollama JSON:', err, response);
  }
  return null;
}
