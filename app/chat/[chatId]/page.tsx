import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
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
    
    if (!userId) {
        redirect('/sign-in');
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    console.log(_chats);
    return (
        <div>{chatId}</div>
    )
}

export default ChatPage;