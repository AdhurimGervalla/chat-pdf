'use client'
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { CheckCircle2, MessageCircle, PlusCircleIcon, StarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

type Props = {
    chats: DrizzleChat[]; // cool
    chatId: number;
    isPro: boolean;
}

const ChatSideBar = ({chats, chatId, isPro}: Props) => {

  const deleteChat = async (chatId: number) => {
    try {
      await axios.post(`/api/delete-chat`, {
        chatId,
        file_key: chats.find((chat) => chat.id === chatId)?.fileKey
        });
      // redirect to /chats route
      window.location.href = '/chats';
    } catch (error) {
      console.log(error);
    }
  }

  const startDelete = (chatId: number) => {
    toast.promise(deleteChat(chatId), {
      loading: 'Deleting chat...',
      success: 'Chat deleted',
      error: 'Couldn\'t delete chat'
    });
  }

  const confirmDelete = (chatId: number) => {
    // Show a toast with confirmation options
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this chat?</p>
        <div>
          <button className='className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"' onClick={() => { 
              toast.dismiss(t.id); 
              startDelete(chatId);
            }}
          >
            Yes, delete it
          </button>
          <button className='ml-5 className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"' onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ), {
      // Customize toast styles if necessary
      style: { width: 'auto' },
      // Set other toast options if needed
    });
  };

  return (
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-100 relative'>
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
                  <Trash2 className='w-4 h-4' onClick={() => confirmDelete(chat.id)} />
                </div>
              </Link>
            )
          })}
        </div>
        <div className='absolute bottom-4 left-0 right-0 px-4'>
            <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
                <Link href='/'>Home</Link>
                <Link href='/chats'>Chats</Link>
                <p className='ml-auto'>{isPro ? 'GPT-4' : 'GPT-3.5-turbo'}</p>
            </div>
        </div>
    </div>
  )
}

export default ChatSideBar