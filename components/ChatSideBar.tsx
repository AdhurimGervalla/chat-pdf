
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
  isPro: boolean;
  chatId: string;
}

const ChatSideBar = async ({ userId, isPro, chatId}: Props) => {
  const _chats: DrizzleChat[] = await db.select().from(chats).orderBy((desc(chats.createdAt))).where(eq(chats.userId, userId));
  
  return (
    <div className='w-full h-screen p-4 relative'>
        <div className='grid grid-cols-1'>
          <div>
            <Link href='/'>
              <Button className='w-full border-dashed border-white border'>
                    <PlusCircleIcon className='mr-2 w-4 h-4' />
                    New chat
                </Button>
            </Link>
          </div>
        </div>
        <div className='mt-3'><ChatListComponent chats={_chats} chatId={chatId} /></div>
        <div className='absolute bottom-4 left-0 right-0 px-4'>
            <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
                <UserButton />
                <p className='ml-auto'>{isPro ? 'GPT-4' : 'GPT-3.5-turbo'}</p>
            </div>
        </div>
    </div>
  )
}

export default ChatSideBar;