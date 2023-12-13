import { db } from "@/lib/db";
import { DrizzleWorkspace, workspaces as workspacesSchema } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async () => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "user not authenticated" }, { status: 400 });
    }

    const _workspaces: DrizzleWorkspace[] = await db.select().from(workspacesSchema).where(eq(workspacesSchema.owner, userId));
    return NextResponse.json(_workspaces);
}