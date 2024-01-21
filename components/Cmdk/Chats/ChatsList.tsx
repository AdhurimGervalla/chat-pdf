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
        <ListItem onSelect={() => handleDetailView(chat)} cnObjects={[{'bg-green-700 text-white': isCurrentChat(chat.id, currentChatId)}]} key={chat.id} cutText={true}>
            {chat.bookmarked && <Bookmark className='w-4 h-4 inline' color={isCurrentChat(chat.id, currentChatId) ? 'white': 'green'} />} {chat.title && chat.title}
        </ListItem>
    ))
  )
}

export default ChatsList