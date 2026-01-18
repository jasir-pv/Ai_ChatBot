import { NextRequest } from 'next/server';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = 'https://api.heygen.com/v1/streaming.new';

export async function POST(request: NextRequest) {
  try {
    if (!HEYGEN_API_KEY) {
      return Response.json(
        { error: 'HeyGen API key not configured' },
        { status: 500 }
      );
    }

    // Create new streaming session
    const response = await fetch(HEYGEN_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quality: 'high',
        avatar_name: 'josh_lite3_20230714', // Default avatar
        voice: {
          voice_id: 'en-US-JennyNeural',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HeyGen API Error:', errorData);
      return Response.json(
        { error: 'Failed to create HeyGen session' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Create session error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
