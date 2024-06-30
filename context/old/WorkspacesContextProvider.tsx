'use client'
import React from 'react'
import { WorkspacesContext } from './WorkspacesContext'
import { WorkspaceWithRole } from '@/lib/types/types'

type Props = {
    children: React.ReactNode
}

function WorkspacesContextProvider({children}: Props) {
  const [workspaces, setWorkspaces] = React.useState<WorkspaceWithRole[]>([]);

  const refetch = async () => {
    const res = await fetch("/api/get-workspaces");
    const data = await res.json();
    setWorkspaces(data.workspaces);
  };

  return <WorkspacesContext.Provider value={{workspaces, setWorkspaces, refetch}}>{children}</WorkspacesContext.Provider>
}

export default WorkspacesContextProvider;