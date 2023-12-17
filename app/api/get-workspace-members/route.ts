import { db } from "@/lib/db";
import { files, messagesToFiles, workspacesToUsers } from "@/lib/db/schema";
import { RelatedFile } from "@/lib/types/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const { workspaceId } = await req.json();
    if (!workspaceId) return NextResponse.json({error: "id is required"}, {status: 400});

    try {
        const members = await db.select().from(workspacesToUsers).where(eq(workspacesToUsers.workspaceId, workspaceId));
        return NextResponse.json({status: 200, members: members});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Could not load members"}, {status: 500});
    }
}