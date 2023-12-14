import React from 'react'
import { Command, CommandItem } from 'cmdk';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { DrizzleChat, DrizzleFile, DrizzleWorkspace } from '@/lib/db/schema';
import { Loader2, Trash } from 'lucide-react';
import ListItem from './ListItem';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {WorkspaceTitle} from './PageTitle';
import FileUpload from '../FileUpload';

type Props = {
    workspace: DrizzleWorkspace;
}

const WorkspaceChatsPage = ({workspace}: Props) => {
    const router = useRouter();
    const {data, isLoading, refetch} = useQuery<{chats: DrizzleChat[], files: DrizzleFile[]}>({
        queryKey: ['WorkspaceChatsPage', workspace.id],
        queryFn: async () => {
            const res = await axios.post('/api/get-chats-from-workspace', { workspaceId: workspace.id });
            return res.data;
        }
    });

    const deleteWorkspace = async () => {
        try {
            await axios.post(`/api/delete-workspace`, {
                workspaceId: workspace.id
            });
            router.push(`/`);
        } 
        catch (error) {
            console.log(error);
        }
    }

    const startDelete = (deleteCb: any, loadingMsg: string, successMsg: string, errorMsg: string) => {
        toast.promise(deleteCb, {
            loading: loadingMsg,
            success: successMsg,
            error: errorMsg
        });
    }

    const deleteFile = async (fileKey: string, workspaceId: number) => {
        try {
            await axios.post(`/api/delete-file`, {
              fileKey,
              workspaceId
            });
            refetch();
        } 
        catch (error) {
            console.log(error);
        }
    }

    

    const confirmDelete = () => {
        // Show a toast with confirmation options
        toast((t) => (
          <div>
            <p>Are you sure you want to delete the workspace?</p>
            <div>
              <button className='className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"' onClick={() => { 
                  toast.dismiss(t.id); 
                  startDelete(deleteWorkspace(), 'Deleting workspace...', 'Workspace deleted', 'Couldn\'t delete workspace');
                }}
              >
                Confirm
              </button>
              <button className='ml-5 className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"' onClick={() => toast.dismiss(t.id)}>Cancel</button>
            </div>
          </div>
        ), {
          // Customize toast styles if necessary
          style: { width: 'auto' },
          // Set other toast options if needed
        });
      };
        
  return (
    <>
    <Command.Group>
        <WorkspaceTitle text={workspace.name}>{workspace.name}<span className='text-gray-500 px-3'>ID: {workspace.id}</span></WorkspaceTitle>
        <ListItem onSelect={confirmDelete} cnObjects={[{'hover:bg-red-500': true}]}>
            <Trash className='w-4 h-4' /> Delete Workspace
        </ListItem>
        <Command.Group className='mt-5'>
          <CommandItem>Upload File:</CommandItem>
          <ListItem cnObjects={[{'p-0' :true}]}>
              <FileUpload workspace={workspace} refetchCb={refetch} />
          </ListItem>
        </Command.Group>

    </Command.Group>
    <Command.Group className='mt-5'>
        
        {!isLoading ? <Command.List>
            {data && data.files.length > 0 ? data.files.map((file) => 
              <ListItem key={file.id} cnObjects={[{'cursor-default': true}]}><span className='flex justify-between flex-row w-full'>
                <a href={file.url} target='_blank' title={file.name}>{file.name}</a>
                <span onClick={() => startDelete(deleteFile(file.key, workspace.id), 'deleting file...', 'deleted file', 'could not delete file')} 
                  className='flex flex-row items-center cursor-pointer hover:text-red-500'>
                    <Trash className='w-4 h-4 mr-2' /> Delete File</span>
                </span>
              </ListItem>) 
            : 
            <CommandItem className='mt-3'>No files found</CommandItem>}
        </Command.List> : <Loader2 className='w-4 h-4 animate-spin block' />}
    </Command.Group>
    <Command.Group className='mt-5'>
        <small>Chats</small>
        {!isLoading ? <Command.List>
            {data && data.chats.length > 0 ? data.chats.map((chat) => <ListItem key={chat.id} onSelect={() => {
                router.push(`/chats/${chat.id}`);
            }}>{chat.title}</ListItem>) : <CommandItem className='mt-3'>No chats found</CommandItem>}
        </Command.List> : <Loader2 className='w-4 h-4 animate-spin block' />}
    </Command.Group>
    </>
  )
}

export default WorkspaceChatsPage