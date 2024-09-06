import { NextResponse } from 'next/server';

export async function POST(request) {
  try {

    const { input } = await request.json();

    // Debug: Check if input was passed
    console.log('Received Input:', input);

    if (!input) {
      console.log('Error: Input is missing');
      return NextResponse.json({ message: 'Input is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();

    // Debug: Ensure API key is loaded
    console.log('Trimmed API Key:', `"${apiKey}"`);

    if (!apiKey) {
      console.log('Error: OpenAI API key is missing');
      return NextResponse.json({ message: 'API key is missing' }, { status: 500 });
    }
    // Augment the input with a task description prompt
    const prompt = `Generate a task description in one line based on this input: ${input}`;

    // Debug: Log the full prompt
    console.log('Sending Prompt to OpenAI:', prompt);

    // Updated API endpoint and payload structure for `gpt-4`
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // Using the latest GPT-4 model
        messages: [{ role: 'user', content: prompt }], // Augmented prompt for generating task description
        max_tokens: 100,
      }),
    });

    // Debug: Log the OpenAI API response status
    console.log('OpenAI Response Status:', response.status);
    console.log('OpenAI Response Status Text:', response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error Details:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();

    // Debug: Log the returned task description
    console.log('Generated Task Description:', text);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error fetching from OpenAI:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
