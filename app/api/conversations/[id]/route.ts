import { NextRequest } from 'next/server';
import {
  getConversation,
  updateConversation,
  deleteConversation,
} from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversation = await getConversation(id);

    if (!conversation) {
      return Response.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return Response.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    return Response.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return Response.json({ error: 'Invalid title provided' }, { status: 400 });
    }

    const updated = await updateConversation(id, { title });

    if (!updated) {
      return Response.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return Response.json(updated);
  } catch (error) {
    console.error('Update conversation error:', error);
    return Response.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteConversation(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return Response.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
