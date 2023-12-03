import React from 'react'
import ChatComponent from './ChatComponent';
import { checkSubscription } from '@/lib/subscription';
import { DrizzleChat, DrizzleWorkspace, chats, messages as _messages, workspaces as workspacesSchema } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import Cmkd from './Cmdk/Cmkd';
import { UserButton } from '@clerk/nextjs';
import DarkModeSwitch from './DarkModeSwitch';

type Props = {
    chatId: string;
    isNewChat?: boolean;
}

const ChatePageComponent = async ({chatId, isNewChat = false}: Props) => {
    const {userId} = await auth();
    if (!userId) return null;
    const isPro = await checkSubscription();
    const _workspaces: DrizzleWorkspace[] = await db.select().from(workspacesSchema).where(eq(workspacesSchema.owner, userId));
    const _chats: DrizzleChat[] = await db.select().from(chats).orderBy(desc(chats.bookmarked),desc(chats.createdAt)).where(eq(chats.userId, userId));
    const currentChat = _chats.find((chat) => chat.id === chatId);

    return (
    <>
    <div className='fixed right-7 top-5 z-10 flex gap-3 items-center justify-center'>
        <div className=''>
            <DarkModeSwitch />
        </div>
        <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-all">
          <UserButton afterSignOutUrl='/' />
        </div>
    </div>
    <Cmkd chats={_chats} workspaces={_workspaces} />
    <div className='flex w-full max-h-screen overflow-hidden border-x-[15px] border-x-transparent'>
            <div className='w-full flex flex-col relative h-[100vh] overflow-scroll'>
                <ChatComponent chatId={chatId} isPro={isPro} chat={currentChat} allChats={_chats} workspaces={_workspaces} />
            </div>
        </div>
    </>
    )
}

export default ChatePageComponent