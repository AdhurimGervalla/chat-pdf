'use client'
import React from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react' 
import { Button } from './ui/button'
import { Loader2, Send } from 'lucide-react'
import MessageList from './MessageList'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Message } from 'ai'
import Select from './Select'
import { cn, languages } from '@/lib/utils'
import {useRouter} from 'next/navigation'
type Props = {
  chatId: string;
  isPro: boolean;
  isNewChat: boolean;
}

export interface ExtendedMessage extends Message {
  pageNumbers: number[]
}

const ChatComponent = ({ isPro, chatId, isNewChat }: Props) => {
  const [chatLanguage, setChatLanguage] = React.useState<string>(languages[0]);
  const router = useRouter();

  const {data} = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await axios.post('/api/get-messages', { chatId });
      return res.data;
    },
    refetchInterval: 0,
  });

  const { input, handleInputChange, handleSubmit, messages, isLoading} = useChat({
    id: chatId,
    api: '/api/chat',
    body: { chatId, chatLanguage },
    initialMessages: data,
    onFinish: (res) => {
        if (isNewChat) {
          router.refresh();
          router.replace(`/chats/${chatId}`);
        }
    }
  }); // cool

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
    <div className='overflow-y-scroll  w-full bottom-10 flex flex-col' id='message-container'>
        <div className='sticky top-0 insex-x-0 p-3 h-fit flex'>
            {false && <Select className='w-15 h-10 ml-auto' options={[...languages]} onChange={(e) => setChatLanguage(e.target.value)} />}
        </div>

        {/* chat messages */}
        <div className='max-w-4xl w-full mx-auto'><MessageList messages={messages} /></div>
      
        <form onSubmit={handleSubmit} className={cn(`sticky bottom-0 inset-x-0 px-2 py-5 w-[20%] mx-auto mt-auto`)}>
          <div className="flex">
            <Input value={input} onChange={handleInputChange} placeholder={isNewChat ? 'How can i help you?' : 'Message me'} className='w-full border-white' />
            <Button className='bg-black dark:bg-white ml-2'>
              {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='h-4 w-4' />}
            </Button>
          </div>
        </form>
    </div>
  )
}

export default ChatComponent;