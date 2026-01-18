import { NextRequest } from 'next/server';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!HEYGEN_API_KEY) {
      return Response.json(
        { error: 'HeyGen API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.heygen.com/v1/streaming/avatar.list', {
      method: 'GET',
      headers: {
        'x-api-key': HEYGEN_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HeyGen List Avatars Error:', errorData);
      return Response.json(
        { error: 'Failed to list avatars', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('List avatars error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
