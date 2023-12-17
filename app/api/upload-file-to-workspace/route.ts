import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { getNamespaceForWorkspace } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const {userId} = await auth();

    if (!userId) {
        return NextResponse.json({error: "unauthorized"}, {status: 401});
    }

    const {file_key, file_name, workspaceIdentifier, workspaceId} = await req.json();

    if (!workspaceIdentifier || !workspaceId) {
        return NextResponse.json({error: "workspace not provided"}, {status: 400});
    }

    try {
        const workspaceNamespace = getNamespaceForWorkspace(workspaceIdentifier, userId);
        
        if (file_key && file_name) {
            const insertedId = await db
            .insert(files)
            .values({
                key: file_key,
                name: file_name,
                workspaceId: workspaceId,
                url: getS3Url(file_key),
                userId,
            }).returning({
                insertedId: files.id
            });

            if (!insertedId[0].insertedId) {
                throw new Error('Could not insert file into db');
            }
            await loadS3IntoPinecone(file_key, workspaceNamespace, insertedId[0].insertedId);
            console.log('loaded s3 into pinecone');
        }

        return NextResponse.json({status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}