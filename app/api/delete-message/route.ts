import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const { message } = await req.json();
    if (!message.id) return NextResponse.json({error: "id is required"}, {status: 400});
    await db.delete(messages).where(or(eq(messages.id, message.id), eq(messages.originId, message.id))).returning({ deletedId: messages.id });
    return NextResponse.json({status: 200});
}