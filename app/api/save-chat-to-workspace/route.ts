import { db } from "@/lib/db";
import { chats, messages, workspaces } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { loadChatIntoPinecone } from "@/lib/pinecone";

export async function POST(req: NextRequest) {
    const {userId} = await auth();
    if (!userId) {
        return NextResponse.json({ error: "user not authenticated" }, { status: 400 });
    }
    const { workspace, chat, apiKey } = await req.json();
    // check if workspaceId and chatId are not empty
    if (!workspace || !chat) {
        return NextResponse.json({ error: "workspaceName not provided" }, { status: 400 });
    }  

    const workspaceId = workspace.id;

    const chatId = chat.id;
    if (workspaceId === chat.workspaceId) {
        return NextResponse.json({ error: "chat already exists in this workspace" }, { status: 409 });
    }

    // update chat with workspaceId
    await db.update(chats).set({ workspaceId }).where(eq(chats.id, chatId));

    const _messages = (await db.select().from(messages).orderBy((asc(messages.createdAt))).where(and(eq(messages.chatId, chatId), eq(messages.role, "assistant"))));

    const workspaceNamespace = workspace.identifier;
    // load chat into pinecone
    await loadChatIntoPinecone(_messages, workspaceNamespace, chatId, apiKey);

    return NextResponse.json({ success: true });
}