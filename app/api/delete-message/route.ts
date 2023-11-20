import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const { message } = await req.json();
    console.log('id to telete', message.id);
    if (!message.id) return NextResponse.json({error: "id is required"}, {status: 400});
    const deletedId = await db.delete(messages).where(or(eq(messages.id, message.id), eq(messages.originId, message.id))).returning({ deletedId: messages.id });
    if (deletedId.length === 0) return NextResponse.json({error: "message not found"}, {status: 404});
    return NextResponse.json({status: 200});
}