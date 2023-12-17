import { db } from "@/lib/db";
import { DrizzleWorkspace, workspaces, workspaces as workspacesSchema, workspacesToUsers } from "@/lib/db/schema";
import { WorkspaceWithRole } from "@/lib/types/types";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async () => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "user not authenticated" }, { status: 400 });
    }

    //const _workspaces: DrizzleWorkspace[] = await db.select().from(workspacesSchema).where(eq(workspacesSchema.owner, userId));

    const ws_mm = await db.select().from(workspacesToUsers).where(eq(workspacesToUsers.userId, userId)).orderBy(asc(workspacesToUsers.workspaceId));

    const allWorkspacesFromUser: WorkspaceWithRole[] = [];

    for (const workspace of ws_mm) {
        const ws = await db.select().from(workspaces).where(eq(workspaces.id, workspace.workspaceId));
        if (ws.length > 0) {
            allWorkspacesFromUser.push({...ws[0], role: workspace.role});
        }
    }

    return NextResponse.json({ status: 200, workspaces: allWorkspacesFromUser });
}