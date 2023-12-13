import ChatePageComponent from '@/components/ChatePageComponent'
import React from 'react'

export const runtime = "edge";

const ChatPage = async ({ params }: { params: { chatId: string } }) => {

    return <ChatePageComponent chatId={params.chatId} />
}

export default ChatPage;