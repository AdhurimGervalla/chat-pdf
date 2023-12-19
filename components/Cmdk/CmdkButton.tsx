import { CmdkOpenStateContext } from '@/context/CmdKOpenStateContext';
import { CommandIcon } from 'lucide-react';
import React from 'react'

type Props = {
    label?: string
    className?: string;
}

const CmdkButton = ({label, className}: Props) => {
const {setOpen} = React.useContext(CmdkOpenStateContext);
  return (
    <span onClick={() => setOpen(true)} className={`w-[fit-content] text-sm tracking-wider leading-5 text-gray-500 dark:text-black flex items-center bg-slate-100 dark:bg-white p-2 py-1 rounded-sm cursor-pointer hover:bg-slate-200 transition-colors ${className}`}>
        <CommandIcon className='w-4 h-4' />+K{label && <span className='max-sm:hidden ml-1'>{label}</span>}
    </span>
  )
}

export default CmdkButton