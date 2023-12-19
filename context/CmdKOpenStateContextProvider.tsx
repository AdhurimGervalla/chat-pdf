'use client'
import React from 'react'
import { CmdkOpenStateContext } from './CmdKOpenStateContext'

type Props = {
    children: React.ReactNode
}

function CmdkOpenStateContextProvider({children}: Props) {
  const [open, setOpen] = React.useState<boolean>(false)
  return <CmdkOpenStateContext.Provider value={{open, setOpen}}>{children}</CmdkOpenStateContext.Provider>
}

export default CmdkOpenStateContextProvider