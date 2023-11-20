import React from 'react'
import ChatSideBar from './ChatSideBar';
import ChatComponent from './ChatComponent';
import { checkSubscription } from '@/lib/subscription';
import { DrizzleChat, DrizzleWorkspace, chats, messages as _messages, workspaces as workspacesSchema } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';

type Props = {
    userId: string;
    chatId: string;
    isNewChat?: boolean;
}

const ChatePageComponent = async ({userId, chatId, isNewChat = false}: Props) => {
    const isPro = await checkSubscription();

    const workspaces: DrizzleWorkspace[] = await db.select().from(workspacesSchema).where(eq(workspacesSchema.owner, userId));
    
    const _chats: DrizzleChat[] = await db.select().from(chats).orderBy((desc(chats.createdAt))).where(eq(chats.userId, userId));

    let currentChat;
    if (!isNewChat) {
        currentChat = _chats.find((chat) => chat.id === chatId);
    }

    return (
    <>
        <div className='flex max-h-screen overflow-scroll'>
            <div className='flex w-full max-h-screen overflow-scroll'>
                {/* chat sidebar */}
                <div className='w-full max-w-xs'>
                    <ChatSideBar chatId={chatId} chats={_chats} userId={userId} isPro={isPro} />
                </div>
                {/* chat viewer 
                <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
                </div>*/}
                {/* chat component */}
                <div className='w-full flex flex-col relative'>
                    <ChatComponent chatId={chatId} isPro={isPro} chat={currentChat} isNewChat={isNewChat} workspaces={workspaces} />
                </div>

            </div>
        </div>
    </>
    )
}

export default ChatePageComponent