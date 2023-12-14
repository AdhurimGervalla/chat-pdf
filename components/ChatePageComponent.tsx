'use client';
import React from 'react'
import ChatComponent from './ChatComponent';
import { DrizzleChat, DrizzleWorkspace, messages as _messages } from '@/lib/db/schema';
import Cmkd from './Cmdk/Cmkd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import HeaderArea from './HeaderArea';

type Props = {
    chatId: string;
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
    <HeaderArea />
    {isLoadingWorkspaces || isLoadingChats && <div className='flex items-center justify-center w-full h-screen'><Loader2 className='w-10 h-10' /></div>}
    <>
            <Cmkd chats={chats} workspaces={workspaces} refetchChats={refetchChats} refetchWorkspaces={refetchWorkspaces} />
            <div className='flex w-full max-h-screen overflow-hidden border-x-[15px] border-x-transparent'>
                <div className='w-full flex flex-col relative h-[100vh] overflow-scroll'>
                    <ChatComponent chatId={chatId} allChats={chats} workspaces={workspaces} refetchChats={refetchChats} />
                </div>
            </div>
        </>
    </>
    )
}

export default ChatePageComponent