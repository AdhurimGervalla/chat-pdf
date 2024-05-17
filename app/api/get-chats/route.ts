import { db } from "@/lib/db";
import { DrizzleChat, chats } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { asc,desc, eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    try {
        const _chats: DrizzleChat[] = await db.select().from(chats).orderBy(desc(chats.bookmarked), desc(chats.createdAt)).where(eq(chats.userId, userId));
        return NextResponse.json(_chats, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'something went wrong' }, { status: 500 });
    }
}