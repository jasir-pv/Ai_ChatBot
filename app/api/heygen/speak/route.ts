import { NextRequest } from 'next/server';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = 'https://api.heygen.com/v1/streaming.task';

export async function POST(request: NextRequest) {
  try {
    const { session_id, text } = await request.json();

    if (!HEYGEN_API_KEY) {
      return Response.json(
        { error: 'HeyGen API key not configured' },
        { status: 500 }
      );
    }

    if (!session_id || !text) {
      return Response.json(
        { error: 'Missing session_id or text' },
        { status: 400 }
      );
    }

    const response = await fetch(HEYGEN_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HeyGen Speak Error:', errorData);
      return Response.json(
        { error: 'Failed to make avatar speak' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Speak error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
