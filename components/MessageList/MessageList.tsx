import React from 'react'
import { Message } from 'ai/react'
import { DrizzleChat, DrizzleMessage } from '@/lib/db/schema'
import MessageItem from './MessageItem'
import { Loader2 } from 'lucide-react'

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
          return <MessageItem key={message.id} message={message} isLoading={isLoading} refetch={refetch} />
        })}
        {messages.length > 0 && messages[messages.length - 1].role === 'user' && <Loader2 className='w-4 h-4 animate-spin' />}
    </div>
    )
}

export default MessageList;