'use client'
import React from 'react'
import { DrizzleChat } from '@/lib/db/schema'
import { ChatsContext } from './ChatsContext'
import axios from 'axios'

type Props = {
    children: React.ReactNode
}

function ChatsContextProvider({children}: Props) {
  const [chats, setChats] = React.useState<DrizzleChat[]>([]);

  const refetch = async () => {
    console.log('refetching chats');
    const res = await axios.post("/api/get-chats");
    setChats(res.data);
  };

  return <ChatsContext.Provider value={{chats, setChats, refetch}}>{children}</ChatsContext.Provider>
}

export default ChatsContextProvider;