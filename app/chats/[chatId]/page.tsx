import ChatePageComponent from '@/components/ChatePageComponent'
import { checkSubscription } from '@/lib/subscription'
import { auth } from '@clerk/nextjs'
import React from 'react'

const ChatPage = async ({ params }: { params: { chatId: string } }) => {

    return <ChatePageComponent chatId={params.chatId} />
}

export default ChatPage;