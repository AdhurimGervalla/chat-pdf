// /api/create-chat

import { db } from "@/lib/db";
import { DrizzleWorkspace, chats, files, messages, workspaces } from "@/lib/db/schema";
import { deletePineconeIndexFromFile } from "@/lib/pinecone";
import { deleteFromS3 } from "@/lib/s3";
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
        const {fileKey, workspaceId} = body;
        if (!fileKey || !workspaceId) return NextResponse.json({error: "file key and workspace Id  is required"}, {status: 400});
        
        if (workspaceId !== 0) {

            const [deletedFile]= await db
            .delete(files)
            .where(eq(files.key, fileKey)).returning({
                deletedFileKey: files.key
            });
            const workspaceList: DrizzleWorkspace[] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
            if (workspaceList.length > 0) {
                const workspace = workspaceList[0];
                const namespace = workspace.identifier;
                await deletePineconeIndexFromFile(namespace, fileKey);
            }
            await deleteFromS3(deletedFile.deletedFileKey);
            return NextResponse.json({status: 200});
        } else {
            return NextResponse.json({error: "workspace not found"}, {status: 404});
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}