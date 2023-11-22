'use client'
import React, { use } from 'react'
import { useChat } from 'ai/react' 
import {Button} from './ui/button'
import { ArrowLeft, PlusCircle } from 'lucide-react'
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
}

const ChatComponent = ({ isPro, chatId, chat, workspaces }: Props) => {
  const [chatLanguage, setChatLanguage] = React.useState<string>(languages[0]);
  const [toggleWorkspaceMode, setToggleWorkspaceMode] = React.useState<boolean>(false);
  const {workspace} = React.useContext(WorkspaceContext);
  const router = useRouter();

  const {data, refetch} = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await axios.post('/api/get-messages', { chatId });
      return res.data;
    }
  });

  const { input, handleInputChange, handleSubmit, messages, isLoading, stop, setMessages} = useChat({
    id: chatId,
    api: '/api/chat',
    body: { chatId, chatLanguage, currentWorkspace: workspace},
    initialMessages: data,
    onResponse: async (message) => {
      router.refresh();
    },
    onFinish: async (message) => {
      await refetch();
    },
    onError: (e) => {
      console.log(e);
    }
  });

  const toggleWorkspaceModeHandler = async (mode: boolean) => {
    setToggleWorkspaceMode(mode);
  }

  React.useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages]);

  React.useEffect(() => {
    setMessages(data);
  }, [data]);

  return (
    <>
        {messages.length === 0 && <Workspaces workspaces={workspaces} chatId={chatId} />}
        <div className='flex flex-col overflow-y-scroll w-full h-full' id='message-container'>
          {/* chat messages */}
          <div className='max-w-4xl w-full mx-auto relative'>
            { messages.length > 0 && <div className={cn('sticky w-min -ml-[20px]', {'top-10': !toggleWorkspaceMode}, {'mt-10': toggleWorkspaceMode})}>
              <div className='absolute -translate-x-[100%] top-[7px]'>
                <div className='flex flex-col gap-3 mb-3'>
                  <Button className='bg-green-500' onClick={() => toggleWorkspaceModeHandler(!toggleWorkspaceMode)} title='Add to workspace'>{!toggleWorkspaceMode ? <PlusCircle className='w-4 h-4' /> : <ArrowLeft className='w-4 h-4' />}</Button>
                </div>
              </div>
            </div>}

            {!toggleWorkspaceMode ? <MessageList messages={messages} refetch={refetch} isLoading={isLoading} /> : <></>}
          </div>
          {toggleWorkspaceMode && <Workspaces workspaces={workspaces} setToggleWorkspaceMode={setToggleWorkspaceMode} saveInWorkspaceMode={true} chatId={chatId} chat={chat} />}
          {/* chat input */}

          <form onSubmit={handleSubmit} className={cn(`sticky bottom-0 inset-x-0 px-2 py-5 w-full max-w-[600px] mx-auto mt-auto`)}>
            <div className="flex">
              <ChatInputComponent handleSubmit={handleSubmit} workspaces={workspaces} stopCb={stop} isPro={isPro} value={input} isLoading={isLoading} onChange={handleInputChange} placeholder={'How can i help you?'} />
            </div>
          </form>
        </div>

    </>
  )
}

export default ChatComponent;