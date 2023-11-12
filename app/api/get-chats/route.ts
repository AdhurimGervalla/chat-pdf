import { db } from "@/lib/db";
import { DrizzleChat, chats } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { asc,desc, eq } from 'drizzle-orm';


export async function POST(req: NextRequest) {
    const { bookmarked, userId } = await req.json();
    if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    const query = db.select().from(chats).orderBy((desc(chats.createdAt)));
    if (bookmarked) {
        const _bookmarkedChatsOnly: DrizzleChat[] = await query.where(eq(chats.bookmarked, bookmarked));
        return NextResponse.json(_bookmarkedChatsOnly, { status: 200 });
    }
    const _allChats: DrizzleChat[] = await query.where(eq(chats.userId, userId)); 
    return NextResponse.json(_allChats, { status: 200 });
}