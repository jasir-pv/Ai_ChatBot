import { NextRequest } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert File to format compatible with OpenAI API
    const buffer = await audioFile.arrayBuffer();
    const file = new File([buffer], 'audio.webm', { type: audioFile.type });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en',
    });

    return Response.json({ text: transcription.text });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return Response.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
