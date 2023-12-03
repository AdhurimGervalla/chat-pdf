import React from 'react'
import { Command } from 'cmdk';
import { cn } from '@/lib/utils';

type Props = {
    children: React.ReactNode | React.ReactNode[];
    cnObjects?: Record<string, boolean>[];
    onSelect?: (cnObject: any) => void;
}

const ListItem = ({children, cnObjects, onSelect}: Props) => {
  return (
    <Command.Item className={cn('mt-3 first:mt-0 cursor-pointer flex flex-row items-center gap-2 bg-green-200 hover:bg-green-600 hover:text-white dark:bg-slate-700 py-1 px-3 rounded-lg dark:hover:bg-slate-800 transition-colors', cnObjects)} onSelect={onSelect}>
        {children}
    </Command.Item>
  )
}

export default ListItem