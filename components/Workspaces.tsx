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

type Props = {
    workspaces: WorkspaceWithRole[];
    saveInWorkspaceMode?: boolean;
    chatId: string;
    chat?: DrizzleChat;
    setToggleWorkspaceMode?: any;
}



const Workspaces = ({workspaces, saveInWorkspaceMode = false, chatId, setToggleWorkspaceMode, chat}: Props) => {
  const router = useRouter();
  const [enteringWorkspaceName, setEnteringWorkspaceName] = React.useState<boolean>(false);
  const [workspaceName, setWorkspaceName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const {workspace, setWorkspace} = React.useContext(WorkspaceContext);


  const handleEnteringWorkspaceName = async () => {
    if (workspaceName.length > 0) {
      try {
        setLoading(true);
        const res = await axios.post(`/api/create-workspace`, {
            workspaceName            
        });
        router.refresh();
        setEnteringWorkspaceName(false);
        setWorkspaceName('');
        setLoading(false);
      } catch (error: any) {
          // check if error status is 409
          // if so, then set workspaceName to ''
          // else, console.log(error)
          if (error.response.status === 400) {
            toast.error('Workspace name already exists');
          }
          console.log(error);
          setLoading(false);
      }
    } else {
      setEnteringWorkspaceName(!enteringWorkspaceName);
    }
  }

  const handleSaveToWorkspace = async () => {
    if (workspace && chat) {
      try {
        const res = await axios.post(`/api/save-chat-to-workspace`, {
          workspace,
          chat
        });
        router.refresh();
        toast.success('Chat saved to workspace');
      } catch (error: any) {
          // check if error status is 409
          // if so, then set workspaceName to ''
          // else, console.log(error)
          if (error.response.status === 409) {
            toast.error('Chat already exists in this workspace');
          }
      }
    }
  }

  const chatWorkspace = workspaces.find((ws) => ws.id === chat?.workspaceId);

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <h3 className='dark:text-slate-700 text-xl mb-5 uppercase tracking-wider font-semibold'>{saveInWorkspaceMode ? 'Save in ...' : 'Specify context ...'}</h3>
      <div className='grid grid-cols-3 gap-5'>
        {workspaces.map((ws) => {
            return (
                  <WorkspaceItem key={ws.id} chatWorkspace={chatWorkspace} workspace={ws} onClick={() => setWorkspace(workspace ? null : ws)} selectedWorkspace={workspace} />
                )
            }
        )}
        {enteringWorkspaceName && (
              <div className='relative'>
                {loading ? <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'><Loader2 className='text-slate-300 animate-spin w-8 h-8 block' /></div> :
                <input
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  value={workspaceName}
                  type="text"
                  name="workspaceName"
                  id="workspaceName"
                  className="absolute h-full block w-full rounded-md border-0 py-1.5 text-white bg-transparent shadow-sm ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6"
                  placeholder="enter a name"
                />}
            </div>
          )  
        }
      </div>

    </div>
   
  )
}

const WorkspaceItem = ({workspace, onClick, selectedWorkspace, chatWorkspace}: {workspace: WorkspaceWithRole, onClick: any, selectedWorkspace: DrizzleWorkspace | null, chatWorkspace?: WorkspaceWithRole}) => {
  return (
    <div onClick={onClick} className={cn('bg-green-100 hover:bg-green-300 text-center dark:bg-slate-900 p-6 rounded-xl dark:hover:bg-green-500 transition-colors cursor-pointer relative before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-xl', {'dark:bg-slate-950  dark:text-slate-600 dark:hover:text-white': selectedWorkspace !== null && workspace.id !== selectedWorkspace?.id}, { 'dark:bg-yellow-500' : chatWorkspace?.id === workspace.id}, {'bg-green-500 text-white': workspace.id === selectedWorkspace?.id})}>
      <h3 className='font-semibold tracking-wide flex justify-center items-center'>{workspace.name} {workspace.role === workspaceRole.MEMBER && <p className='absolute top-1 left-2 text-[9px] tracking-widest'>{getRoleName(workspace.role)}</p>}</h3>
    </div>
  )
}

export default Workspaces