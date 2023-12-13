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
import { Menu } from 'lucide-react';

type Props = {
    chatId: string;
    isNewChat?: boolean;
}

const ChatePageComponent = async ({chatId, isNewChat = false}: Props) => {
    const {userId} = await auth();
    if (!userId) return null;
    const isPro = await checkSubscription();
    /* TODO: dont fetch workspaces here */
    const _workspaces: DrizzleWorkspace[] = await db.select().from(workspacesSchema).where(eq(workspacesSchema.owner, userId));
    /* TODO: dont fetch chats here */
    const _chats: DrizzleChat[] = await db.select().from(chats).orderBy(desc(chats.bookmarked),desc(chats.createdAt)).where(eq(chats.userId, userId));
    const currentChat = _chats.find((chat) => chat.id === chatId);

    return (
    <>
    <div className='fixed z-10 top-0 left-0 right-0 flex gap-3 items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-950'>
        <div className='flex gap-3'>
            <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-all">
                <UserButton afterSignOutUrl='/' />
            </div>
            <div className=''>
                <DarkModeSwitch />
            </div>
        </div>
        <div><Menu className='w-8 h-8 cursor-pointer' /></div>
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