import { db as dbClient } from "@/lib/db";
import { workspaceRole, workspaces, workspacesToUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { setNameSpaceForWorkspace } from "@/lib/utils";
 
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const {userId} = await auth();
    if (!userId) {
        return NextResponse.json({ error: "user not authenticated" }, { status: 400 });
    }
    const { workspaceName } = await req.json();

    // check if workspaceName is not empty
    if (!workspaceName) {
        return NextResponse.json({ error: "workspaceName not provided" }, { status: 400 });
    }

    // remove all special characters and spaces from workspaceName
    const identifier = setNameSpaceForWorkspace(workspaceName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(), userId);

    // check if workspace already exists for this user
    const _workspace = await dbClient.select().from(workspaces).where(and(eq(workspaces.owner, userId), eq(workspaces.identifier, identifier)));
    if (_workspace.length > 0) {
        return NextResponse.json({ error: "workspace already exists" }, { status: 400 });
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    // create workspace
    try {
        await db.transaction(async (tx) => {
            const insertedId = await tx.insert(workspaces).values({
                name: workspaceName,
                identifier,
                owner: userId,
            }).returning({ id: workspaces.id });
            await tx.insert(workspacesToUsers).values({
                userId,
                workspaceId: insertedId[0].id,
                role: workspaceRole.OWNER,
            });
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Could not create workspace" }, { status: 500 });
    }


    return NextResponse.json({ success: true });
}