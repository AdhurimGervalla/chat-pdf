'use client'
import { WorkspaceContext } from '@/context/WorkspaceContext'
import { DrizzleChat, DrizzleWorkspace, workspaceRole } from '@/lib/db/schema'
import { WorkspaceWithRole } from '@/lib/types/types'
import { cn, getRoleName } from '@/lib/utils'
import axios from 'axios'
import { ArrowLeft, Loader2, PlusCircleIcon, PlusIcon, SaveIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast'
import Select from './Select'

type Props = {
    workspaces: WorkspaceWithRole[];
    saveInWorkspaceMode?: boolean;
    chatId: string;
    chat?: DrizzleChat;
    setToggleWorkspaceMode?: any;
}



const Workspaces = ({workspaces, saveInWorkspaceMode = false, chatId, setToggleWorkspaceMode, chat}: Props) => {
  const {workspace, setWorkspace} = React.useContext(WorkspaceContext);
  const chatWorkspace = workspaces.find((ws) => ws.id === chat?.workspaceId);

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-[fit-content] lg:w-auto'>
      <h3 className='dark:text-slate-700 text-xl mb-5 uppercase tracking-wider font-semibold'>{saveInWorkspaceMode ? 'Save in ...' : 'Specify context ...'}</h3>
      <div className='grid-cols-2 lg:grid-cols-3 gap-5 hidden md:grid'>
        {workspaces.map((ws) => {
            return (
                  <WorkspaceItem key={ws.id} chatWorkspace={chatWorkspace} workspace={ws} onClick={() => setWorkspace(workspace ? null : ws)} selectedWorkspace={workspace} />
                )
            }
        )}
      </div>
      <div className='block md:hidden'>
        <Select workspaces={workspaces}>
        </Select>
      </div>
    </div>
   
  )
}

const WorkspaceItem = ({workspace, onClick, selectedWorkspace, chatWorkspace}: {workspace: WorkspaceWithRole, onClick: any, selectedWorkspace: DrizzleWorkspace | null, chatWorkspace?: WorkspaceWithRole}) => {
  return (
    <div onClick={onClick} className={cn('bg-green-100 hover:bg-green-300 text-center dark:bg-slate-900 p-6 rounded-xl dark:hover:bg-slate-900 transition-colors cursor-pointer relative before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-xl', {'dark:bg-slate-950  dark:text-slate-600 dark:hover:text-white': selectedWorkspace !== null && workspace.id !== selectedWorkspace?.id}, { 'dark:bg-yellow-500' : chatWorkspace?.id === workspace.id}, {'bg-green-500 text-white': workspace.id === selectedWorkspace?.id})}>
      <h3 className='tracking-wide flex justify-center items-center text-base'>{workspace.name} {workspace.role === workspaceRole.MEMBER && <p className='absolute top-1 left-2 text-[9px] leading-3 tracking-widest'>{getRoleName(workspace.role)}</p>}</h3>
    </div>
  )
}

export default Workspaces