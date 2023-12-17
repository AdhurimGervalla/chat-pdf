import React from 'react'
import { Message } from 'ai/react'
import { DrizzleChat, DrizzleMessage } from '@/lib/db/schema'
import MessageItem from './MessageItem'

type Props = {
    messages: Message[] | DrizzleMessage[];
    refetch: any;
    isLoading: boolean;
    allChats?: DrizzleChat[];
}

const MessageList = ({messages, refetch, isLoading = false, allChats}: Props) => {

    if (!messages) return <></>;

    return (
    <div className='flex flex-col gap-3'>
        {messages.map((message) => {
          return <MessageItem key={message.id} message={message} allChats={allChats} isLoading={isLoading} refetch={refetch} />
        })}
    </div>
    )
}

export default MessageList;