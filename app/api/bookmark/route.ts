import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { DrizzleChat, chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';


export async function POST(req: NextRequest) {
    const {chat} = await req.json();

    if (!chat) {
        return NextResponse.json({error: 'chat not provided'}, {status: 400})
    }

    const bookmarked = await db.update(chats).set({bookmarked: !chat.bookmarked}).where(eq(chats.id, chat.id)).returning({bookmarked: chats.bookmarked})
    return NextResponse.json(bookmarked[0], {status: 200})
}