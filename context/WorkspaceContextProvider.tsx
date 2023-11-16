'use client'
import { DrizzleWorkspace } from '@/lib/db/schema'
import React from 'react'
import { WorkspaceContext } from './WorkspaceContext'

type Props = {
    children: React.ReactNode
}

function WorkspaceContextProvider({children}: Props) {
  const [workspace, setWorkspace] = React.useState<DrizzleWorkspace|null>(null)
  return <WorkspaceContext.Provider value={{workspace, setWorkspace}}>{children}</WorkspaceContext.Provider>
}

export default WorkspaceContextProvider