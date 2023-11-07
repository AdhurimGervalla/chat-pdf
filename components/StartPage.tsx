import { UserButton } from '@clerk/nextjs'
import React from 'react'
import SubscriptionButton from './SubscriptionButton'
import FileUpload from './FileUpload'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
    firstChat: any,
    isPro: boolean
}

const StartPage = ({firstChat, isPro}: Props) => {
  return (
    <div className='left-1/2 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 max-w-screen-xl pt-10'>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className='mr-3 text-5xl font-semibold'>We have teacher at home...</h1>
            <UserButton afterSignOutUrl='/' />
          </div>
          <div className="flex mt-5">
            <Link href={`/chats/${firstChat.id}`}><Button>Go to chats <ArrowRight className='ml-2' /></Button></Link>
            {false && <div className='ml-3'><SubscriptionButton isPro={isPro}/></div>}
          </div>
          <div className='mt-4 max-w-sm w-full'>
            <FileUpload />
          </div>
        </div>
    </div>
  )
}

export default StartPage