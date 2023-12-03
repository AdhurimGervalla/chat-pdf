import { db } from "@/lib/db";
import { DrizzleChat, chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { workspaceId } = await req.json();
    if (!workspaceId || workspaceId === 0) return NextResponse.json({ message: 'Workspace ID required' }, { status: 400 });

    try {
        const allChatsFromWorkspace: DrizzleChat[] = await db.select().from(chats).where(eq(chats.workspaceId, workspaceId));
        return NextResponse.json(allChatsFromWorkspace, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'something went wrong' }, { status: 500 });
    }

}