import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react'

type Props = {
    relatedChatIds: string[];
    allChats: DrizzleChat[];
}

const RelatedChats = ({relatedChatIds, allChats}: Props) => {
  return (
    <p className='my-4 bg-green-100 dark:bg-slate-800 px-3 py-1'>Related Chats: {relatedChatIds.map((id, index) => {
            if (id) {
              let chatTitle = 'Chat ' + (index+1);
              if (allChats) {
                const chat = allChats.find(c => c.id === id);
              if (chat && chat.title) {
                chatTitle = chat.title;
              }
            }
            return (
            <Link key={id} className='mr-5 hover:text-green-500 transition-colors' href={`/chats/${id}`}>{chatTitle}</Link>
            )
        }
        })}
    </p>
  )
}

export default RelatedChats