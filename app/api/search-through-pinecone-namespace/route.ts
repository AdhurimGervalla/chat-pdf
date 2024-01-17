import { getContext } from "@/lib/context";
import { getNamespaceForWorkspace } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    let { message, currentWorkspace } = await req.json();

    if (!message || !currentWorkspace) {
        return NextResponse.json({ 'error': 'message or currentWorkspace not provided' }, { status: 400 })
    }

    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ 'error': 'user not authenticated' }, { status: 400 })
    }

    const contextMetadata = await getContext(message, getNamespaceForWorkspace(currentWorkspace.identifier, currentWorkspace.owner));

    return NextResponse.json(contextMetadata, { status: 200 })
}