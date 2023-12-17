import { db } from "@/lib/db";
import { DrizzleWorkspace, workspaces, workspacesToUsers } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async () => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "user not authenticated" }, { status: 400 });
    }

    const ws_mm = await db.select().from(workspacesToUsers).where(eq(workspacesToUsers.userId, userId)).orderBy(asc(workspacesToUsers.workspaceId));

    const sharedWorkspaces: DrizzleWorkspace[] = [];

    for (const workspace of ws_mm) {
        const ws = await db.select().from(workspaces).where(eq(workspaces.id, workspace.workspaceId));
        if (ws.length > 0) {
            sharedWorkspaces.push(ws[0]);
        }
    }

    return NextResponse.json({ status: 200, workspaces: sharedWorkspaces });
}