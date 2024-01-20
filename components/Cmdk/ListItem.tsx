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
    <Command.Item className={cn('mt-2 first:mt-0 cursor-pointer flex flex-row items-center gap-2 hover:bg-slate-100 py-1 px-3 rounded-lg -mx-3 dark:hover:bg-slate-800 transition-colors overflow-hidden whitespace-nowrap text-ellipsis', cnObjects)} onSelect={onSelect}>
        {children}
    </Command.Item>
  )
}

export default ListItem