import {neon, neonConfig} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';
import { DrizzleChat, chats } from './schema';
import { eq } from 'drizzle-orm';
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable');
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);

// returns the first chat of a user
export async function getFirstChat(userId: string): Promise<DrizzleChat | undefined> {
    let firstChat;
    if (userId) {
      firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
      if (firstChat) {
        firstChat = firstChat[0];
      }
      return firstChat;
    }
  }