import { Loader2, Save } from 'lucide-react';
import React from 'react'
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import axios from 'axios';

type ChatTitleProps = {
    chatId: string;
    text: string;
    refetchChats: () => void;
}

export const ChatTitle = ({chatId, text, refetchChats}: ChatTitleProps) => {
  const [textState, setTextState] = React.useState(text);
  const [dirty, setDirty] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dirty) {
      setDirty(true);
    }
    setTextState(e.target.value);
  }

  const handleUpdate = async () => {
    setLoading(true);
    await axios.put(`/api/update-chat-title`, {
      chatId,
      title: textState
    });
    setDirty(false);
    setLoading(false);
    refetchChats();
  }

  const handleKeyEvent = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.stopPropagation();
    }
  }


  return (
    <>
      <div className='flex gap-5 items-center mb-3'>
        <Input type="text" onChange={handleChange} value={textState} className='px-0 font-bold' onKeyDown={handleKeyEvent}  />
        <button onClick={handleUpdate}>{loading ? <Loader2 className='animate-spin w-6 h-6' />:<Save className={cn(`w-6 h-6 hover:text-green-500 transition-colors`, {'opacity-40 cursor-default hover:text-inherit': !dirty})} />}</button>
      </div>
    </>
  )
}

type WorkspaceTitleProps = {
  children: React.ReactNode | React.ReactNode[];
  text: string;
}

export const WorkspaceTitle = ({children}: WorkspaceTitleProps) => {
  return (
    <h3 className='text-lg mb-5 font-bold'>{children}</h3>
  )
}