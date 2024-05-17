import { db } from "@/lib/db";
import { chats, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const {userId} = await auth();
    if (!userId) {
        return NextResponse.json({'error': 'no user'}, {status: 403})
    }
    const {apiKey} = await req.json();

    if (!apiKey) {
        return NextResponse.json({'error': 'apiKey not provided'}, {status: 400})
    }

    await db
    .update(users)
    .set({
        apiKey: apiKey
    })
    .where(eq(users.userId, userId));

    return NextResponse.json({success: true});
}