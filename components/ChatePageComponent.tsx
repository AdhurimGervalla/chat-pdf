import React from 'react'
import ChatSideBar from './ChatSideBar';
import ChatComponent from './ChatComponent';
import { checkSubscription } from '@/lib/subscription';
import { DrizzleChat, chats } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';

type Props = {
    userId: string;
    chatId: string;
    isNewChat?: boolean;
}

const ChatePageComponent = async ({userId, chatId, isNewChat = false}: Props) => {
    const isPro = await checkSubscription();

    return (
    <>
        <div className='flex max-h-screen overflow-scroll'>
            <div className='flex w-full max-h-screen overflow-scroll'>
                {/* chat sidebar */}
                <div className='w-full max-w-xs'>
                    <ChatSideBar chatId={chatId} userId={userId} isPro={isPro} />
                </div>
                {/* chat viewer 
                <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
                </div>*/}
                {/* chat component */}
                <ChatComponent chatId={chatId} isPro={isPro} isNewChat={isNewChat} />
            </div>
        </div>
    </>
    )
}

export default ChatePageComponent