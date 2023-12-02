'use client'
import React, { use } from 'react'
import { useChat } from 'ai/react' 
import {Button} from './ui/button'
import { ArrowLeft, Loader, Loader2, PlusCircle } from 'lucide-react'
import MessageList from './MessageList'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { cn, languages } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import ChatInputComponent from './ChatInputComponent'
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema'
import { WorkspaceContext } from '@/context/WorkspaceContext'
import { revalidatePath } from 'next/cache'
import Workspaces from './Workspaces'

type Props = {
  chatId: string;
  isPro: boolean;
  workspaces: DrizzleWorkspace[];
  chat?: DrizzleChat;
  allChats?: DrizzleChat[];
}

const ChatComponent = ({ isPro, chatId, chat, workspaces, allChats }: Props) => {
  const [chatLanguage, setChatLanguage] = React.useState<string>(languages[0]);
  const [loadingMessages, setLoadingMessages] = React.useState<boolean>(true);
  const [scrollDown, setScrollDown] = React.useState<boolean>(true);
  const [generatingChatTitle, setGeneratingChatTitle] = React.useState<boolean>(false);
  const [chatTitle, setChatTitle] = React.useState<string>(chat?.title || '');
  const {workspace} = React.useContext(WorkspaceContext);
  const router = useRouter();

  const {data, refetch} = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await axios.post('/api/get-messages', { chatId });
      setLoadingMessages(false);
      return res.data;
    }
  });

  const { input, handleInputChange, handleSubmit, messages, isLoading, stop, setMessages} = useChat({
    id: chatId,
    api: '/api/chat',
    body: { chatId, chatLanguage, currentWorkspace: workspace},
    initialMessages: data,
    onResponse: async (message) => {
    },
    onFinish: async (message) => {
      await refetch();
      router.refresh();
    },
    onError: (e) => {
      console.log(e);
    }
  });



  React.useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      })
    }

    if (chat && chat.title === '' && messages && messages.length > 0) {
      setGeneratingChatTitle(true);
    }
  }, [messages, scrollDown, chat]);

  React.useEffect(() => {
    setMessages(data);
  }, [data]);

  React.useEffect(() => {
    if (generatingChatTitle) {
      setGeneratingChatTitle(false);
      (async () => {
        if (data[0]) {
          const res = await axios.post('/api/create-chat-title', { chatId: data[0].chatId, firstQuestion: data[0].content });
          setChatTitle(res.data.title);
          router.refresh();
        }
      })();
    }
  }, [generatingChatTitle, chatTitle]);

  return (
    <>
        <div className='flex flex-col overflow-y-scroll w-full h-full' id='message-container'>
          {loadingMessages ? <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'><Loader2 className='w-[50px] h-[50px] animate-spin' /></div> : (messages.length === 0 ? <Workspaces workspaces={workspaces} chatId={chatId} />
          :
          <div className='max-w-4xl w-full mx-auto relative'>
            <h1 className='text-3xl mt-10 font-bold'>{chatTitle !== '' ? chatTitle : <Loader2 className='w-4 h-4 animate-spin inline' />}</h1>
            <MessageList messages={messages} refetch={refetch} isLoading={isLoading} allChats={allChats} />
          </div>) }

          {/* chat input */}
          <form onSubmit={handleSubmit} className={cn(`sticky bottom-0 inset-x-0 pt-10 w-full max-w-4xl mx-auto mt-auto`)}>
            <div className="flex">
              <ChatInputComponent handleSubmit={handleSubmit} workspaces={workspaces} stopCb={stop} isPro={isPro} value={input} isLoading={isLoading} onChange={handleInputChange} placeholder={'How can i help you?'} />
            </div>
          </form>
        </div>
    </>
  )
}

export default ChatComponent;