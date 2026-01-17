import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { createMessage } from '@/lib/db/queries';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Create user message in database
    const userMessage = messages[messages.length - 1];
    if (conversationId && userMessage.role === 'user') {
      await createMessage({
        conversationId,
        role: 'user',
        content: userMessage.content,
      });
    }

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    let fullResponse = '';

    // Create ReadableStream for streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          // Save assistant message to database after streaming completes
          if (conversationId && fullResponse) {
            await createMessage({
              conversationId,
              role: 'assistant',
              content: fullResponse,
            });
          }

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
