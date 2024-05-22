// /api/create-chat

import { db } from "@/lib/db";
import { DrizzleWorkspace, chats, messages, workspaces } from "@/lib/db/schema";
import { deletePineconeIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const {userId} = await auth();
    if (!userId) {
        return NextResponse.json({error: "unauthorized"}, {status: 401});
    }
    try {
        const body = await req.json();
        const {chatId, workspaceId} = body;
        if (!chatId) return NextResponse.json({error: "chatId is required"}, {status: 400});

        await db
            .delete(chats)
            .where(eq(chats.id, chatId));
        
        if (workspaceId !== 0) {
            const workspaceList: DrizzleWorkspace[] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
            if (workspaceList.length > 0) {
                const workspace = workspaceList[0];
                const namespace = workspace.identifier;
                await deletePineconeIndex(namespace, chatId);
            }
        }

        /*if (file_key) {
            await deleteFromS3(file_key);
        }*/
        return NextResponse.json({status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}