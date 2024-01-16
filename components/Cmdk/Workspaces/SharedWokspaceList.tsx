import React from 'react'
import ListItem from '../ListItem'
import { List, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DrizzleWorkspace } from '@/lib/db/schema';
import axios from 'axios';

type Props = {
    handeOnSelect: any;
}

const SharedWokspaceList = ({handeOnSelect}: Props) => {
    const {data, isLoading, refetch} = useQuery<{workspaces: DrizzleWorkspace[]}>({
        queryKey: ['sharedWorkspaces'],
        queryFn: async () => {
            const res = await axios.get('/api/get-shared-workspaces');
            return res.data;
        }
    });

    return (
        !isLoading ? (data?.workspaces && data.workspaces.length > 0 ? data.workspaces.map((workspace) => (
            <ListItem onSelect={() => handeOnSelect(['workspaceDetail', workspace.id])} key={workspace.id}>
                <List className='w-4 h-4' /> {workspace.name}
            </ListItem>
        )) : 'No shared workspaces')
        :
        <Loader2 className='animate-spin' />
    )
}

export default SharedWokspaceList