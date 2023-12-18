import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = 'edge';

export async function POST(req: Request) {
    
    try {
        const payload: WebhookEvent = await req.json();
        if (payload.type !== "user.created" && payload.type !== "user.deleted") return NextResponse.json({ message: "not a correct event to handle" }, { status: 400 });
        if (!payload.data.id) return Response.json({ message: "user could no be created because of missing id" }, { status: 400 });
        
        if (payload.type === "user.created") {
            const user_id = await db
                .insert(users)
                .values({
                    userId: payload.data.id,
                    email: payload.data.email_addresses[0].email_address,
                }).returning({
                    insertedId: users.userId
                });
                return NextResponse.json({user_id: user_id[0].insertedId}, {status: 200});
        }

        if (payload.type === "user.deleted") {
            const user_id = await db
                .delete(users)
                .where(eq(
                    users.userId,
                    payload.data.id,
                )).returning({
                    deletedId: users.userId
                });
                return NextResponse.json({user_id: user_id[0].deletedId}, {status: 200});
        }
        return NextResponse.json({ message: "not a correct event to handle" }, { status: 400 });
        
        } catch (error) {
            return NextResponse.json({
                error,
                status: 500,
            });
    }
}