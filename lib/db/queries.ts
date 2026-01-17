import { db } from './index';
import { conversations, messages, type NewConversation, type NewMessage } from './schema';
import { eq, desc } from 'drizzle-orm';

export async function createConversation(data: NewConversation) {
  const [conversation] = await db.insert(conversations).values(data).returning();
  return conversation;
}

export async function getConversation(id: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  return conversation;
}

export async function getAllConversations() {
  return db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt));
}

export async function updateConversation(id: string, data: Partial<NewConversation>) {
  const [updated] = await db
    .update(conversations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning();
  return updated;
}

export async function deleteConversation(id: string) {
  await db.delete(conversations).where(eq(conversations.id, id));
}

export async function createMessage(data: NewMessage) {
  const [message] = await db.insert(messages).values(data).returning();

  // Update conversation's updatedAt timestamp
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, data.conversationId));

  return message;
}

export async function getMessages(conversationId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function deleteMessage(id: string) {
  await db.delete(messages).where(eq(messages.id, id));
}
