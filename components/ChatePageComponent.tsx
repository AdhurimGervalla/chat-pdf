'use client';
import React from 'react'
import ChatComponent from './ChatComponent';
import { checkSubscription } from '@/lib/subscription';
import { DrizzleChat, DrizzleWorkspace, chats, messages as _messages, workspaces as workspacesSchema } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import Cmkd from './Cmdk/Cmkd';
import { UserButton } from '@clerk/nextjs';
import DarkModeSwitch from './DarkModeSwitch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

type Props = {
    chatId: string;
    isNewChat?: boolean;
}

const ChatePageComponent = ({chatId}: Props) => {
    const {data: workspaces, refetch: refetchWorkspaces, isLoading: isLoadingWorkspaces} = useQuery<DrizzleWorkspace[]>({
        queryKey: ['workspaces', chatId],
        queryFn: async () => {
          const res = await axios.get('/api/get-workspaces');
          return res.data;
        }
      });

    const {data: chats, refetch: refetchChats, isLoading: isLoadingChats} = useQuery<DrizzleChat[]>({
    queryKey: ['chats', chatId],
    queryFn: async () => {
        const res = await axios.post('/api/get-chats');
        return res.data;
    }
    });

    return (
    <>
    <div className='fixed right-7 top-5 z-10 flex gap-3 items-center justify-center'>
        <div className=''>
            <DarkModeSwitch />
        </div>
        <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-all">
          <UserButton afterSignOutUrl='/' />
        </div>
    </div>
    {isLoadingWorkspaces || isLoadingChats && <div className='flex items-center justify-center w-full h-screen'><Loader2 className='w-10 h-10' /></div>}
    {chats && workspaces && 
        <>
            <Cmkd chats={chats} workspaces={workspaces} refetchChats={refetchChats} refetchWorkspaces={refetchWorkspaces} />
            <div className='flex w-full max-h-screen overflow-hidden border-x-[15px] border-x-transparent'>
                <div className='w-full flex flex-col relative h-[100vh] overflow-scroll'>
                    <ChatComponent chatId={chatId} chat={chats.find((chat) => chat.id === chatId)} allChats={chats} workspaces={workspaces} refetchChats={refetchChats} />
                </div>
            </div>
        </>
    }
    </>
    )
}

export default ChatePageComponent