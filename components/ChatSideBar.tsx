'use client'
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { MessageCircle, PlusCircleIcon, StarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

type Props = {
    chats: DrizzleChat[]; // cool
    chatId: number;
}

const ChatSideBar = ({chats, chatId}: Props) => {

  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-100'>
        <Link href={'/'}>
            <Button className='w-full border-dashed border-white border'>
                <PlusCircleIcon className='mr-2 w-4 h-4' />
                New chat
            </Button>
        </Link>
        <div className="flex flex-col gap-2 mt-4">
          {chats.map((chat) => {
            return (
              <Link href={`/chats/${chat.id}`} key={chat.id}>
                <div 
                  className={cn('rounded-lg p-3 text-slate-900 flex gap-1 items-center', { 
                    'bg-blue-600 text-white': chat.id === chatId,
                    'hover:text-white hover:bg-blue-600': chat.id !== chatId
                  })}
                >
                  <MessageCircle />
                  <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className='absolute bottom-4 left-4'>
            <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
                <Link href='/'>Home</Link>
                <Link href='/chats'>Chats</Link>
                <Button className='mt-2 text-white bg-slate-700' disabled={loading} onClick={handleSubscription}>
                  <StarIcon className='mr-2 w-4 h-4' />
                  Upgrade to Pro!
                </Button>
            </div>
        </div>
    </div>
  )
}

export default ChatSideBar