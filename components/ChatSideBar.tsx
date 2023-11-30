
import { DrizzleChat, chats } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import ChatListComponent from './ChatListComponent';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';

type Props = {
  userId: string;
  chats: DrizzleChat[];
  isPro: boolean;
  chatId: string;
}

const ChatSideBar = async ({ userId, isPro, chatId, chats}: Props) => {
  
  return (
    <div className='w-full h-screen p-4 relative'>
        <div className='mt-3'><ChatListComponent chats={chats} chatId={chatId} isPro={isPro} /></div>
        <div className='absolute bottom-4 left-0 right-0 px-4'>
        </div>
    </div>
  )
}

export default ChatSideBar;