import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
    const {chatId} = await req.json();
    const _messages = await db.select().from(messages).where(eq(messages.chatId, chatId));
    const convertedMessages = _messages.map(msg => {
        let pageNumbers;
        if (msg.pageNumbers) {
            pageNumbers = JSON.parse(msg.pageNumbers);
        }
        return {...msg, pageNumbers}
    })
    return NextResponse.json(convertedMessages);
}