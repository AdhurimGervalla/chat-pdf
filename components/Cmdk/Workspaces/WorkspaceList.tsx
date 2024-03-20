import React from 'react'
import ListItem from '../ListItem';
import { List } from 'lucide-react';
import { WorkspaceWithRole } from '@/lib/types/types';
import { getRoleName } from '@/lib/utils';
import { useWorkspacesContext } from '@/context/WorkspacesContext';

type Props = {
    handeOnSelect: any;
}

const WorkspaceList = ({handeOnSelect}: Props) => {
  const { workspaces } = useWorkspacesContext();
  
  return (
    workspaces.map((workspace) => (
        <ListItem onSelect={() => handeOnSelect(['workspaceDetail', workspace.id])} key={workspace.id}>
            <List className='w-4 h-4' /><p className='flex justify-between items-center w-full'><span>{workspace.name}</span><span className={'text-xs'}>{getRoleName(workspace.role)}</span></p>
        </ListItem>
    ))
  )
}

export default WorkspaceList