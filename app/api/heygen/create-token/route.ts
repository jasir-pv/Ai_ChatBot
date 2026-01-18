import { NextRequest } from 'next/server';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!HEYGEN_API_KEY) {
      return Response.json(
        { error: 'HeyGen API key not configured' },
        { status: 500 }
      );
    }

    // Create streaming token using HeyGen API
    const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: {
        'x-api-key': HEYGEN_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HeyGen Token API Error:', errorData);
      return Response.json(
        { error: 'Failed to create streaming token', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.error) {
      console.error('HeyGen Token Error:', data.error);
      return Response.json(
        { error: data.error },
        { status: 400 }
      );
    }

    return Response.json({ token: data.data.token });
  } catch (error) {
    console.error('Create token error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
