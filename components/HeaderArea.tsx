import React from 'react'
import DarkModeSwitch from './DarkModeSwitch'
import { UserButton } from '@clerk/nextjs'

type Props = {}

const HeaderArea = (props: Props) => {
  return (
    <div className='fixed right-7 top-5 z-10 flex gap-3 items-center justify-center'>
        <div className=''>
            <DarkModeSwitch />
        </div>
        <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-all">
          <UserButton afterSignOutUrl='/' />
        </div>
    </div>
  )
}

export default HeaderArea