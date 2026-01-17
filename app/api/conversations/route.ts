import { NextRequest } from 'next/server';
import {
  getAllConversations,
  createConversation,
} from '@/lib/db/queries';

export async function GET() {
  try {
    const conversations = await getAllConversations();
    return Response.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    return Response.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return Response.json(
        { error: 'Invalid title provided' },
        { status: 400 }
      );
    }

    const conversation = await createConversation({ title });
    return Response.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Create conversation error:', error);
    return Response.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
