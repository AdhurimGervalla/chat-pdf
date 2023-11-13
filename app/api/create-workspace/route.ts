import { db } from "@/lib/db";
import { workspaces } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const { workspaceName } = await req.json();

    // check if workspaceName is not empty
    if (!workspaceName) {
        return NextResponse.json({ error: "workspaceName not provided" }, { status: 400 });
    }

    // remove all special characters and spaces from workspaceName
    const identifier = workspaceName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // check if workspace already exists
    const _workspace = await db.select().from(workspaces).where(eq(workspaces.identifier, identifier));
    if (_workspace.length > 0) {
        return NextResponse.json({ error: "workspace already exists" }, { status: 400 });
    }

    // create workspace
    await db.insert(workspaces).values({
        name: workspaceName,
        identifier,
        createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
}