import { db } from "@/lib/db";
import { users, workspaceRole, workspaces, workspacesToUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    const {userId} = await auth();

    if (!userId) {
        return NextResponse.json({ error: "user not authenticated" }, { status: 400 });
    }
    const { workspaceId, eMail } = await req.json();

    if (!workspaceId) {
        return NextResponse.json({ error: "workspaceName not provided" }, { status: 400 });
    }

    const workspace = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.owner, userId)));

    if (!workspace) {
        return NextResponse.json({ error: "You are not owner of the workspace" }, { status: 400 });
    }

    // check if email is valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(eMail)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.email, eMail));

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await db.insert(workspacesToUsers).values({
        workspaceId: workspaceId,
        userId: user[0].userId,
        role: workspaceRole.MEMBER,
    });

    return NextResponse.json({ success: true });
}