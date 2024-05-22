// /api/create-chat

import { db as dbClient} from "@/lib/db";
import { DrizzleWorkspace, chats, messages, workspaces } from "@/lib/db/schema";
import { deletePineconeNamespace } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
 
export async function POST(req: Request, res: Response) {
    const {userId} = await auth();

    if (!userId) {
        return NextResponse.json({error: "unauthorized"}, {status: 401});
    }

    try {
        const body = await req.json();
        const {workspaceId} = body;
        if (!workspaceId) return NextResponse.json({error: "workspace id is required"}, {status: 400});

        const workspace: DrizzleWorkspace[] = await dbClient.select().from(workspaces).where(eq(workspaces.id, workspaceId));
        
        if (workspace.length === 0) return NextResponse.json({error: "workspace not found"}, {status: 404}); // workspace not found
        const theWorkspace = workspace[0];
        if (theWorkspace.owner !== userId) return NextResponse.json({error: "unauthorized"}, {status: 401}); // only owner can delete workspace
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const db = drizzle(pool);
        
        try {
            await db.transaction(async (tx) => {
                // get all chats from workspace
                const allChatsFromWorkspace = await tx.select().from(chats).where(eq(chats.workspaceId, workspaceId));
                
                // delete all messages from chats
                const allChatsFromWorkspaceIds = allChatsFromWorkspace.map(chat => chat.id);

                if (allChatsFromWorkspaceIds.length > 0) {
                    await tx.delete(messages).where(inArray(messages.chatId, allChatsFromWorkspaceIds));
            
                    // delete all chats
                    await tx.delete(chats).where(eq(chats.workspaceId, workspaceId));
                }
    
                // delete workspace
                await tx.delete(workspaces).where(eq(workspaces.id, workspaceId));
    
                // delete pinecone namespace
                await deletePineconeNamespace(theWorkspace.identifier);
            });
        } catch (error) {
            console.log(error);
            return NextResponse.json({error: "Could not delete workspace"}, {status: 500});
        }

        return NextResponse.json({success: true}, {status: 200});

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}