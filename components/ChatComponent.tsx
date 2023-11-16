'use client'
import React, { use } from 'react'
import { useChat } from 'ai/react' 
import {Button} from './ui/button'
import { FilterIcon, Loader2, PlusCircle, SaveIcon, Send } from 'lucide-react'
import MessageList from './MessageList'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Message } from 'ai'
import Select from './Select'
import { cn, languages } from '@/lib/utils'
import {useRouter} from 'next/navigation'
import ChatInputComponent from './ChatInputComponent'
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema'
import Workspaces from './Workspaces'
import { WorkspaceContext } from '@/context/WorkspaceContext'

type Props = {
  chatId: string;
  isPro: boolean;
  isNewChat: boolean;
  workspaces: DrizzleWorkspace[];
  chat?: DrizzleChat;
}

export interface ExtendedMessage extends Message {
  pageNumbers: number[]
}

const ChatComponent = ({ isPro, chatId, isNewChat, chat, workspaces }: Props) => {
  const [chatLanguage, setChatLanguage] = React.useState<string>(languages[0]);
  const [toggleWorkspaceMode, setToggleWorkspaceMode] = React.useState<boolean>(false);
  const [choosingWorkspace, setChoosingWorkspace] = React.useState<boolean>(false);
  const {workspace} = React.useContext(WorkspaceContext);
  const router = useRouter();

  const {data} = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await axios.post('/api/get-messages', { chatId });
      return res.data;
    },
    refetchInterval: 0,
  });

  const { input, handleInputChange, handleSubmit, messages, isLoading, stop} = useChat({
    id: chatId,
    api: '/api/chat',
    body: { chatId, chatLanguage, currentWorkspace: workspace },
    initialMessages: data,
    onResponse: (res) => {
      if (isNewChat) {
        router.replace(`/chats/${chatId}`);
      }
    },
    onFinish: () => {
      router.refresh();
    }
  }); // cool

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

  return (
    <>
        <div className='flex flex-col overflow-y-scroll w-full h-full' id='message-container'>
        <div className='sticky top-0 insex-x-0 p-3 h-fit flex'>
            {false && <Select className='w-15 h-10 ml-auto' options={[...languages]} onChange={(e) => setChatLanguage(e.target.value)} />}
        </div>

        {/* chat messages */}
        <div className='max-w-4xl w-full mx-auto relative'>
          {!isNewChat && <div className='absolute -left-10 top-[6px] -translate-x-[100%]'>
            <div className='flex flex-col gap-3 mb-3'>
              <Button onClick={() => toggleWorkspaceModeHandler(!toggleWorkspaceMode)} title='Add to workspace'><PlusCircle className='w-4 h-4' /></Button>
            </div>
            <div className='flex flex-col gap-3'>
              <Button onClick={() => setChoosingWorkspace(!choosingWorkspace)} title='Filter Workspace'><FilterIcon className='w-4 h-4' /></Button>
            </div>
          </div>}

          {/* chat header */}
          {chat && <h1 className='text-4xl mb-7'>{chat.title}</h1>}
          {!toggleWorkspaceMode && <MessageList messages={messages} />}
        </div>
        {(toggleWorkspaceMode || isNewChat || choosingWorkspace) && <Workspaces workspaces={workspaces} setToggleWorkspaceMode={setToggleWorkspaceMode} creatingWorkspace={!isNewChat && !choosingWorkspace} chatId={chatId} chat={chat} />}
        <form onSubmit={handleSubmit} className={cn(`sticky bottom-0 inset-x-0 px-2 py-5 w-full max-w-[600px] mx-auto mt-auto`)}>
          <div className="flex">
            <ChatInputComponent stopCb={stop} isPro={isPro} value={input} isLoading={isLoading} onChange={handleInputChange} placeholder={isNewChat ? 'How can i help you?' : 'Message me'} />
          </div>
        </form>
    </div>

    </>
  )
}

export default ChatComponent;