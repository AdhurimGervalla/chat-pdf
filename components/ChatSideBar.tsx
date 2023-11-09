'use client'
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { PlusCircleIcon, Trash2 } from 'lucide-react';
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid' 
import axios from 'axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import FileUpload from './FileUpload';

type Props = {
    chats: DrizzleChat[]; // cool
    chatId: number;
    isPro: boolean;
}

const ChatSideBar = ({chats, chatId, isPro}: Props) => {
  const [openNewChat, setOpenNewChat] = React.useState(false);

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
    <div className='w-full h-screen p-4 relative'>
        <Button className='w-full border-dashed border-white border' onClick={() => setOpenNewChat(!openNewChat)}>
            <PlusCircleIcon className='mr-2 w-4 h-4' />
            New chat
        </Button>
        <NewChat openNewChat={openNewChat} setOpenNewChat={setOpenNewChat} />
        <ul role="list" className="divide-y divide-gray-100 mt-3">
          {chats.map((chat) => {
            return (
              <Link href={`/chats/${chat.id}`} key={chat.id}>
                <li className="flex py-2">
                  <div className="min-w-0 flex justify-between items-center w-full">
                    <p className={cn('text-sm font-semibold leading-6 text-gray-900 max-w-[200px] mr-3 whitespace-nowrap overflow-hidden text-ellipsis ', { 
                    'text-lime-600': chat.id === chatId,
                    'hover:text-lime-600': chat.id !== chatId
                  })}>{chat.pdfName}</p>
                    {/**/}
                    <Popover className="relative">
                      <Popover.Button className="flex font-semibold leading-6 text-gray-900">
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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
                        
                            <div className='block p-2 flex items-center justify-between hover:text-red-600' onClick={() => confirmDelete(chat.id)}>
                              Delete chat<Trash2 className='w-4 h-4' />
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  </div>
                </li>
              </Link>
            )
          })}
        </ul>
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

const NewChat = ({openNewChat, setOpenNewChat}: {openNewChat: boolean, setOpenNewChat: (open: boolean) => void}) => {
  return (
    <div className={cn(`mt-3 ${openNewChat ? 'hidden' : 'block'}`)}>
    <div className='grid grid-cols-1 gap-3'>
      <div>
        <FileUpload setOpenNewChatCb={setOpenNewChat} />
      </div>
      <button disabled className=' bg-gray-100 opacity-40 text-center px-3 py-1 border-2 border-dashed text-sm'>Chat with GPT</button>
    </div>
  </div>
  )
}

export default ChatSideBar