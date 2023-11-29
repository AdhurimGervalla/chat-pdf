import React from 'react'
import ChatSideBar from './ChatSideBar';
import ChatComponent from './ChatComponent';
import { checkSubscription } from '@/lib/subscription';
import { DrizzleChat, DrizzleWorkspace, chats, messages as _messages, workspaces as workspacesSchema } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import Cmkd from './Cmkd';

type Props = {
    chatId: string;
    isNewChat?: boolean;
}

const ChatePageComponent = async ({chatId, isNewChat = false}: Props) => {
    const {userId} = await auth();
    const isPro = await checkSubscription();

    if (!userId) return null;

    const _workspaces: DrizzleWorkspace[] = await db.select().from(workspacesSchema).where(eq(workspacesSchema.owner, userId));
    
    const _chats: DrizzleChat[] = await db.select().from(chats).orderBy(desc(chats.bookmarked),desc(chats.createdAt)).where(eq(chats.userId, userId));

    const currentChat = _chats.find((chat) => chat.id === chatId);

    return (
    <>
        <Cmkd chats={_chats} workspaces={_workspaces} />
        <div className='flex max-h-screen overflow-scroll'>
            <div className='flex w-full max-h-screen overflow-scroll'>
                <div className='w-full flex flex-col relative h-[100vh]'>
                    <ChatComponent chatId={chatId} isPro={isPro} chat={currentChat} allChats={_chats} workspaces={_workspaces} />
                </div>
            </div>
        </div>
    </>
    )
}

export default ChatePageComponent