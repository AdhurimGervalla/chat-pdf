import { DrizzleWorkspace } from '@/lib/db/schema';
import React from 'react'
import ListItem from '../ListItem';
import { List } from 'lucide-react';

type Props = {
    workspaces: DrizzleWorkspace[];
    handeOnSelect: any;
}

const WorkspaceList = ({workspaces, handeOnSelect}: Props) => {
  return (
    workspaces.map((workspace) => (
        <ListItem onSelect={() => handeOnSelect(['workspaceDetail', workspace.id])} key={workspace.id}>
            <List className='w-4 h-4' /> {workspace.name}
        </ListItem>
    ))
  )
}

export default WorkspaceList