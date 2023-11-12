// /api/create-chat

import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
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
        const {file_key, chatId} = body;
        if (!chatId) return NextResponse.json({error: "chatId is required"}, {status: 400});

        // Delete messages first to avoid foreign key constraint error
        await db
        .delete(messages)
        .where(eq(messages.chatId, chatId));

        await db
            .delete(chats)
            .where(eq(chats.id, chatId));
        
            if (file_key) {
                await deleteFromS3(file_key);
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