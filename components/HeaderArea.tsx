import React from 'react'
import DarkModeSwitch from './DarkModeSwitch'
import { UserButton } from '@clerk/nextjs'
import CmdkButton from './Cmdk/CmdkButton'

type Props = {}

const HeaderArea = (props: Props) => {
  return (
    <div className='fixed top-0 z-10 flex gap-3 items-center justify-between w-full border-x-[15px] border-transparent py-[15px] dark:bg-slate-950'>
        <div className='flex justify-center'>
          <CmdkButton large={false} />
        </div>
        <div className='flex gap-3'>
          <div className=''>
              <DarkModeSwitch />
          </div>
          <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-all">
            <UserButton afterSignOutUrl='/' />
          </div>
        </div>

    </div>
  )
}

export default HeaderArea