import { cn } from '@/lib/utils'
import React from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from 'ai/react'
import { DeleteIcon } from 'lucide-react'
import axios from 'axios'
import { DrizzleChat, DrizzleMessage } from '@/lib/db/schema'
import Link from 'next/link'
import MessageItem from './MessageItem'

type Props = {
    messages: Message[] | DrizzleMessage[];
    refetch: any;
    isLoading: boolean;
    allChats?: DrizzleChat[];
}

const MessageList = ({messages, refetch, isLoading = false, allChats}: Props) => {

    if (!messages) return <></>;
    
    const deleteMessage = async (message: Message) => {
      try {
        await axios.post('/api/delete-message', { message: message });
        refetch();
      } catch (e) {
        console.log(e);
      }
    }

    return (
    <div className='flex flex-col gap-3'>
        {messages.map((message, index) => {
          return <MessageItem key={message.id} message={message} allChats={allChats} isLoading={isLoading} refetch={refetch} />
        })}
    </div>
    )
}

export default MessageList;