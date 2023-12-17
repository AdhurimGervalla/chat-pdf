import { db } from "@/lib/db";
import { files, messagesToFiles } from "@/lib/db/schema";
import { RelatedFile } from "@/lib/types/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const { messageId } = await req.json();
    if (!messageId) return NextResponse.json({error: "id is required"}, {status: 400});

    try {
        const relatedData: RelatedFile[] = [];
        const messageFileData = await db.select().from(messagesToFiles).where(eq(messagesToFiles.messageId, messageId));
        if (messageFileData.length === 0) return NextResponse.json({status: 200, data: relatedData});
    
        for (const messageFile of messageFileData) {
            const file = messageFile.fileId 
            ? await db.select().from(files).where(eq(files.id, messageFile.fileId))
            : null;
        
            if (file) {
                relatedData.push({
                    url: file[0].url,
                    pageNumbers: JSON.parse(messageFile.pageNumbers || "[]")
                });
            }
        }

        return NextResponse.json({status: 200, data: relatedData});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Could not load context from workspace"}, {status: 500});
    }
}