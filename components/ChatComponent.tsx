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
import { languages } from '@/lib/utils'

type Props = {
  chatId: number
}

export interface ExtendedMessage extends Message {
  pageNumbers: number[]
}

const ChatComponent = ({chatId}: Props) => {

  const [chatLanguage, setChatLanguage] = React.useState<string>(languages[0]);

  const {data} = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await axios.post<ExtendedMessage[]>('/api/get-messages', { chatId });
      return res.data;
    },
    refetchInterval: false,
  });

  const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
    api: '/api/chat',
    body: { chatId, chatLanguage },
    initialMessages: data,
  }); // cool

  React.useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      })
    }
    console.log(messages);
  }, [messages]);

  return (
    <div className='relative max-h-screen overflow-scroll' id='message-container'>
        <div className='sticky top-0 insex-x-0 p-3 bg-white h-fit flex'>
            <h3 className='text-xl font-bold'>Chat</h3>
            <Select className='w-15 h-10 ml-auto' options={[...languages]} onChange={(e) => setChatLanguage(e.target.value)} />
        </div>

        {/* chat messages */}
        <MessageList messages={messages} />

        <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4'>
          <div className="flex">
          <Input value={input} onChange={handleInputChange} placeholder='Ask me...' className='w-full' />
            <Button className='bg-black ml-2'>
              {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='h-4 w-4' />}
            </Button>
          </div>
        </form>
    </div>
  )
}

export default ChatComponent;