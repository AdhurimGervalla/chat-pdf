'use client'
import React from 'react'
import { MessagesContext } from './MessagesContext'

type Props = {
    children: React.ReactNode
}

function MessagesContextProvider({children}: Props) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = React.useState<boolean>(true);
  const refetch = () => {

  }
  return <MessagesContext.Provider value={{messages, setMessages, refetch, loadingMessages, setLoadingMessages}}>{children}</MessagesContext.Provider>
}

export default MessagesContextProvider