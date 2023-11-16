'use client'
import { WorkspaceContext } from '@/context/WorkspaceContext'
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { ArrowLeft, Loader2, PlusCircleIcon, PlusIcon, SaveIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { createContext, Dispatch, SetStateAction } from 'react'
import toast from 'react-hot-toast'

type Props = {
    workspaces: DrizzleWorkspace[];
    creatingWorkspace?: boolean;
    chatId: string;
    chat?: DrizzleChat;
    setToggleWorkspaceMode?: any;
}



const Workspaces = ({workspaces, creatingWorkspace = false, chatId, setToggleWorkspaceMode, chat}: Props) => {
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
      <h3 className='text-slate-700 text-xl mb-5 uppercase tracking-wider font-semibold'>{creatingWorkspace ? 'Choose a workspace ...' : 'Workspace'}</h3>
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
        {!creatingWorkspace ? <WorkSpaceControls  onClick={handleEnteringWorkspaceName}><h3 className='font-semibold tracking-wide flex justify-center items-center'><span>{enteringWorkspaceName ? (workspaceName.length > 0 ? <SaveIcon /> : <ArrowLeft />) : 'New'}</span>{!enteringWorkspaceName && <PlusCircleIcon className='w-4 h-4 ml-3' />}</h3></WorkSpaceControls> 
          : workspace && <WorkSpaceControls onClick={handleSaveToWorkspace}><h3 className='font-semibold tracking-wide flex justify-center items-center'><span><SaveIcon /></span></h3></WorkSpaceControls>}
      </div>

    </div>
   
  )
}

const WorkspaceItem = ({workspace, onClick, selectedWorkspace, chatWorkspace}: {workspace: DrizzleWorkspace, onClick: any, selectedWorkspace: DrizzleWorkspace | null, chatWorkspace?: DrizzleWorkspace}) => {
  return (
    <div onClick={onClick} className={cn('bg-slate-500 text-center dark:bg-slate-900 p-6 rounded-xl dark:hover:bg-green-500 transition-colors cursor-pointer relative before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-xl', {'dark:bg-slate-950  text-slate-600 dark:hover:text-white': selectedWorkspace !== null && workspace.id !== selectedWorkspace?.id}, { 'dark:bg-blue-400' : chatWorkspace}, {'dark:bg-green-500 dark:text-white': workspace.id === selectedWorkspace?.id})}>
      <h3 className='font-semibold tracking-wide flex justify-center items-center'>{workspace.name}</h3>
    </div>
  )
}

const WorkSpaceControls = ({onClick, children}: {onClick: any, children: any}) => {
  return (
    <div onClick={onClick} className={cn('bg-slate-500 min-w-[115px] text-center dark:bg-slate-900 p-6 rounded-xl dark:hover:bg-green-500 transition-colors cursor-pointer relative before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-xl')}>
      {children}
    </div>
  )
}

export default Workspaces