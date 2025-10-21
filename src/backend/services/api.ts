import { personalityPrompts } from './personalities';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const getAIResponse = async (
  personality: string,
  history: Message[]
): Promise<string> => {
  try {
    // Make sure to create a .env file to enter your GEMINI api key as "GEMINI_API_KEY"
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Missing Gemini API key');
    console.log(
      `Fetching AI response for ${personality} with history:`,
      history
    );

    const instructions = personalityPrompts[personality] || '';
    const contents = [
      {
        parts: [
          {
            text: `You are ${personality} and you ${instructions}. IMPORTANT: Respond in plain text without any Markdown formatting (no asterisks, no bold, no italics, no bullet points).`,
          },
        ],
      },
      ...history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    ];

    console.log('Calling Gemini API...');

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    // Access the response text
    const candidate = data.candidates?.[0];
    const aiResponse = candidate?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      console.error('Unexpected response structure:', data);
      throw new Error('Gemini returned no response text');
    }

    return aiResponse || 'Gemini returned no response.';
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return 'Sorry, something went wrong. Please try again.';
  }
};
