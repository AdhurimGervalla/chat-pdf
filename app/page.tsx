import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link';
import {LogIn} from 'lucide-react';

export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  return (
    <div className='w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600'>
      <div className='mx-auto my-auto max-w-screen-xl'>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className='mr-3 text-5xl font-semibold'>Give me a PDF and chat with me</h1>
            <UserButton afterSignOutUrl='/' />
          </div>
          <div className="flex mt-2">
            {isAuth && <Button>Go to chats</Button>}
          </div>
          <p className='text-lg mt-1'>Join now to unlock your full potential</p>
          <div className='mt-4'>
            {isAuth ? (<h1>fileupload</h1>) : <Link href={'/sign-in'}><Button>Login to get started <LogIn className='w-5 h-5 ml-2' /></Button></Link>}
          </div>
        </div>
      </div>
    </div>
  )
}
