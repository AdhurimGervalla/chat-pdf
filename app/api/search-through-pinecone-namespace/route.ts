import { getContext } from "@/lib/context";
import { getNamespaceForWorkspace } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    let { message, currentWorkspace } = await req.json();

    console.log('message', message);
    console.log('currentWorkspace', currentWorkspace);

    if (!message || !currentWorkspace) {
        return NextResponse.json({ 'error': 'message or currentWorkspace not provided' }, { status: 400 })
    }

    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ 'error': 'user not authenticated' }, { status: 400 })
    }
    // debounce the context request to avoid rate limiting
    //await new Promise(resolve => setTimeout(resolve, 200));
    const contextMetadata = await getContext(message, getNamespaceForWorkspace(currentWorkspace.identifier, currentWorkspace.owner));

    return NextResponse.json(contextMetadata, { status: 200 })
}