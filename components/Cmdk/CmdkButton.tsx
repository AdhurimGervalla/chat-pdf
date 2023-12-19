import { CmdkOpenStateContext } from '@/context/CmdKOpenStateContext';
import { cn } from '@/lib/utils';
import { CommandIcon, Menu } from 'lucide-react';
import React from 'react'

type Props = {
    label?: string
    className?: string;
    large?: boolean;
}

const CmdkButton = ({label, className, large = false}: Props) => {
const {setOpen} = React.useContext(CmdkOpenStateContext);

  const getText = () => {
    return 'test';
  }

  return (
    <div onClick={() => setOpen(true)} className='flex items-center gap-3'>
      <span className={`flex bg-slate-100 dark:bg-white p-2 py-1 rounded-sm cursor-pointer hover:bg-slate-200 transition-colors dark:text-black dark:hover:bg-slate-300`}>
          {/*<span className='hidden md:block'><CommandIcon className={cn('w-4 h-4', {'w-6 h-6': large})} />+K{label && <span className='max-sm:hidden ml-1'>{label}</span>}</span>*/}
          <span className='flex items-center gap-3'><Menu /></span>
      </span>
      <span className={`hidden md:flex w-[fit-content] text-sm tracking-wider leading-5 text-gray-500 dark:text-slate-400 items-center ${className} ${large ? 'text-[1.4rem] tracking-widest' : ''}`}><CommandIcon className={cn('w-4 h-4', {'w-6 h-6': large})} />+K{label && <span className='max-sm:hidden ml-1'>{label}</span>}</span>
    </div>
  )
}

export default CmdkButton