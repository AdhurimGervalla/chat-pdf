'use client'
import React, { use } from 'react'
import { useChat } from 'ai/react' 
import {Button} from './ui/button'
import { PlusCircle } from 'lucide-react'
import MessageList from './MessageList'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { cn, languages } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import ChatInputComponent from './ChatInputComponent'
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema'
import { WorkspaceContext } from '@/context/WorkspaceContext'

type Props = {
  chatId: string;
  isPro: boolean;
  isNewChat: boolean;
  workspaces: DrizzleWorkspace[];
  chat?: DrizzleChat;
}

const ChatComponent = ({ isPro, chatId, isNewChat, chat, workspaces }: Props) => {
  const [chatLanguage, setChatLanguage] = React.useState<string>(languages[0]);
  const [toggleWorkspaceMode, setToggleWorkspaceMode] = React.useState<boolean>(false);
  const [triggerRefetch, setTriggerRefetch] = React.useState<boolean>(false);
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
    onResponse: () => {
      if (isNewChat) {
        router.replace(`/chats/${chatId}`);
      }
    },
    onFinish: async (message) => {
      await refetch();
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

  React.useEffect(() => {
    if (triggerRefetch) {
      refetch();
      setTriggerRefetch(false);
    }
  }, [triggerRefetch]);

  const getTitle = () => {
    if (chat) return chat.title;
    if (isLoading) return 'generating ...';
    return '';
  }

  return (
    <>
        <div className='flex flex-col overflow-y-scroll w-full h-full' id='message-container'>
          {/* chat messages */}
          <div className='max-w-4xl w-full mx-auto relative'>
            {!isNewChat && false && <div className='sticky w-min top-5 -ml-[20px]'>
              <div className='absolute -translate-x-[100%] top-[7px]'>
                <div className='flex flex-col gap-3 mb-3'>
                  <Button className='bg-yellow-500' onClick={() => toggleWorkspaceModeHandler(!toggleWorkspaceMode)} title='Add to workspace'><PlusCircle className='w-4 h-4' /></Button>
                </div>
              </div>
            </div>}

            {/* chat header */}

            {!toggleWorkspaceMode && <MessageList messages={messages} setTriggerRefetch={setTriggerRefetch} isLoading={isLoading} />}
          </div>
          <form onSubmit={handleSubmit} className={cn(`sticky bottom-0 inset-x-0 px-2 py-5 w-full max-w-[600px] mx-auto mt-auto`)}>
            <div className="flex">
              <ChatInputComponent workspaces={workspaces} stopCb={stop} isPro={isPro} value={input} isLoading={isLoading} onChange={handleInputChange} placeholder={isNewChat ? 'How can i help you?' : 'Message me'} />
            </div>
          </form>
        </div>

    </>
  )
}

export default ChatComponent;