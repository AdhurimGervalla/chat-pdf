import { db } from "@/lib/db";
import { workspaces } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

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
    const identifier = workspaceName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // check if workspace already exists for this user
    const _workspace = await db.select().from(workspaces).where(and(eq(workspaces.owner, userId), eq(workspaces.identifier, identifier)));
    if (_workspace.length > 0) {
        return NextResponse.json({ error: "workspace already exists" }, { status: 400 });
    }

    // merge identifier with userId
    // this makes sure that the identifier is unique for each user
    

    // create workspace
    await db.insert(workspaces).values({
        name: workspaceName,
        identifier,
        createdAt: new Date(),
        owner: userId,
    });

    return NextResponse.json({ success: true });
}