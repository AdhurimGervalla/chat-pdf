import ChatePageComponent from '@/components/ChatePageComponent'
import React from 'react'

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
    return <ChatePageComponent chatId={params.chatId} />
}

export default ChatPage;