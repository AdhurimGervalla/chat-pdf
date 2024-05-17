import { db } from "@/lib/db";
import { DrizzleUsers, users } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    try {
        const _user: DrizzleUsers[] = await db.select().from(users).where(eq(users.userId, userId));
        if (_user.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(_user[0], { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'something went wrong' }, { status: 500 });
    }
}