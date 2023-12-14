import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const {chatId, title} = await req.json();
    const {userId} = await auth();
    if (!chatId) {
        return NextResponse.json({'error': 'chatId not provided'}, {status: 400})
    }
    if (!title) {
        return NextResponse.json({'error': 'title not provided'}, {status: 400})
    }
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length === 0) {
        // chat doesn't exist
        return NextResponse.json({'error': 'chat not found'}, {status: 404})
    }
    if (_chats[0].userId !== userId) {
        return NextResponse.json({'error': 'unauthorized'}, {status: 401})
    }
    await db
    .update(chats)
    .set({
        title: title.substring(0, 250).replace(/'/g, "''"),
    })
    .where(eq(chats.id, chatId));
    return NextResponse.json({success: true});
}