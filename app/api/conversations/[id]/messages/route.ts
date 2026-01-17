import { NextRequest } from 'next/server';
import { getMessages } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await getMessages(id);
    return Response.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return Response.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
