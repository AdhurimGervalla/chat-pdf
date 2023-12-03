import React from 'react'
import { Command, CommandItem } from 'cmdk';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema';
import { Loader2, Trash } from 'lucide-react';
import ListItem from './ListItem';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PageTitle from './PageTitle';

type Props = {
    workspace: DrizzleWorkspace;
}

const WorkspaceChatsPage = ({workspace}: Props) => {
    const router = useRouter();
    const {data, isLoading} = useQuery<DrizzleChat[]>({
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

    const startDelete = () => {
        toast.promise(deleteWorkspace(), {
            loading: 'Deleting workspace...',
            success: 'Workspace deleted',
            error: 'Couldn\'t delete workspace'
        });
    }
    

    const confirmDelete = () => {
        // Show a toast with confirmation options
        toast((t) => (
          <div>
            <p>Are you sure you want to delete the workspace?</p>
            <div>
              <button className='className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"' onClick={() => { 
                  toast.dismiss(t.id); 
                  startDelete();
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
        <PageTitle>{workspace.name}</PageTitle>
        <ListItem onSelect={confirmDelete} cnObjects={[{'hover:bg-red-500': true}]}>
            <Trash className='w-4 h-4' /> Delete Workspace
        </ListItem>
    </Command.Group>
    <Command.Group className='mt-5'>
        <small>Chats</small>
        {!isLoading ? <Command.List>
            {data && data.length > 0 ? data.map((chat) => <ListItem key={chat.id} onSelect={() => {
                router.push(`/chats/${chat.id}`);
            }}>{chat.title}</ListItem>) : <CommandItem className='mt-3'>No chats found</CommandItem>}
        </Command.List> : <Loader2 className='w-4 h-4 animate-spin block' />}
    </Command.Group>
    </>
  )
}

export default WorkspaceChatsPage