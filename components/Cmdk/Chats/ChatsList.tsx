import { DrizzleChat } from '@/lib/db/schema';
import React from 'react'
import ListItem from '../ListItem';
import { isCurrentChat, trimChatTitle } from '@/lib/utils';
import { Bookmark } from 'lucide-react';

type Props = {
    chats: DrizzleChat[];
    currentChatId: string;
    handleDetailView: any;
}

const ChatsList = ({chats, currentChatId, handleDetailView}: Props) => {
  return (
    chats.map((chat) => (
        <ListItem onSelect={() => handleDetailView(chat)} cnObjects={[{'bg-green-700 text-white': isCurrentChat(chat.id, currentChatId)}]} key={chat.id}>
            {chat.bookmarked && <Bookmark className='w-4 h-4' color={isCurrentChat(chat.id, currentChatId) ? 'white': 'green'} />} {chat.title && trimChatTitle(chat.title)}
        </ListItem>
    ))
  )
}

export default ChatsList