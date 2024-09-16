import { NextResponse } from 'next/server';

export async function POST(request) {
  try {

    const { input } = await request.json();


    if (!input) {
      return NextResponse.json({ message: 'Input is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();


    if (!apiKey) {
      return NextResponse.json({ message: 'API key is missing' }, { status: 500 });
    }
    const prompt = `Generate a task description in one line based on this input: ${input}`;


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


    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error Details:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();


    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error fetching from OpenAI:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
