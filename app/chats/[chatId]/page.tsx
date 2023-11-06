import ChatComponent from '@/components/ChatComponent'
import ChatSideBar from '@/components/ChatSideBar'
import PDFViewer from '@/components/PDFViewer'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { checkSubscription } from '@/lib/subscription'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

type ChatePageProps = {
    params: {
        chatId: string  
    }   
}

const ChatPage = async ({params: { chatId }}: ChatePageProps) => {
    const {userId} = await auth();
    const isPro = await checkSubscription();

    if (!userId) {
        redirect('/sign-in');
    }
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    if (!_chats || !_chats.find((chat) => chat.id === parseInt(chatId))) {
        redirect('/');
    }

    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

    return (
        <div className='flex max-h-screen overflow-scroll'>
            <div className='flex w-full max-h-screen overflow-scroll'>
                {/* chat sidebar */}
                <div className='flex-[1] max-w-xs'>
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
                </div>
                {/* chat viewer */}
                <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
                </div>
                {/* chat component */}
                <div className='flex-[3] border-l-4 border-l-slate-200'>
                    <ChatComponent chatId={parseInt(chatId)} />
                </div>
            </div>
        </div>
    )
}

export default ChatPage;