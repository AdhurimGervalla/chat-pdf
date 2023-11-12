import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(req: Request) {
    
    try {
        const payload: WebhookEvent = await req.json();
        if (payload.type !== "user.created") return NextResponse.json({ message: "not a user created event" }, { status: 400 });
        if (!payload.data.id) return Response.json({ message: "user could no be created because of missing id" }, { status: 400 });
        const user_id = await db
            .insert(users)
            .values({
                userId: payload.data.id,
            }).returning({
                insertedId: users.userId
            });
            return NextResponse.json({user_id: user_id[0].insertedId}, {status: 200});
        } catch (error) {
            return NextResponse.json({
                error,
                status: 500,
            });
    }
}