'use client'
import { DrizzleChat } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid' 
import { Bookmark, PlusCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import BookmarkComponent from './BookmarkComponent';
import { v4 } from "uuid";

type Props = {
    chat: DrizzleChat;
    currentChatId?: string;
    isPro: boolean;
}

const ChatSettings = ({chat, currentChatId, isPro}: Props) => {
    const router = useRouter();
    const deleteChat = async (chatId: string) => {
        try {
            await axios.post(`/api/delete-chat`, {
              chatId,
              file_key: chat?.fileKey
              });
            const newChatId = v4();
            router.refresh();
            router.push(`/chats/${newChatId}`);
          } catch (error) {
            console.log(error);
          }
      }
    
      const startDelete = (chatId: string) => {
        toast.promise(deleteChat(chatId), {
          loading: 'Deleting chat...',
          success: 'Chat deleted',
          error: 'Couldn\'t delete chat'
        });
      }
    
      const confirmDelete = (chatId: string) => {
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
    
        <li className="flex py-2">
        <div className="min-w-0 flex justify-between items-center w-full">
            <p className={cn('text-sm font-semibold leading-6 transition-colors text-gray-900 dark:text-white max-w-[200px] mr-3 whitespace-nowrap overflow-hidden text-ellipsis ', { 
            'text-lime-600 dark:text-green-500': chat.id === currentChatId,
            'hover:text-lime-600 dark:hover:text-green-500': chat.id !== currentChatId
        })}><Link href={`/chats/${chat.id}`} key={chat.id}>{chat.title}</Link></p>
            {/**/}
            <Popover className="relative">
            <Popover.Button className="flex font-semibold leading-6 text-gray-900">
                <ChevronDownIcon className="h-5 w-5 dark:text-white" aria-hidden="true" />
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-min -translate-x-1/2 px-4">
                <div className="w-40 shrink rounded-xl bg-white px-3 py-1 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                    <BookmarkComponent chat={chat} />
                    <div className='cursor-pointer block p-2 flex items-center justify-between hover:text-red-600' onClick={() => confirmDelete(chat.id)}>
                        Delete chat<Trash2 className='w-4 h-4' />
                    </div>
                </div>
                </Popover.Panel>
            </Transition>
            </Popover>
        </div>
        </li>

  )
}

export default ChatSettings