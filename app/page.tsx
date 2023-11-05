import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link';
import {ArrowRight, LogIn} from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { checkSubscription } from '@/lib/subscription';
import SubscriptionButton from '@/components/SubscriptionButton';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();

  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className='w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600'>
      <div className='left-1/2 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 max-w-screen-xl pt-10'>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className='mr-3 text-5xl font-semibold'>We have teacher at home...</h1>
            <UserButton afterSignOutUrl='/' />
          </div>
          <div className="flex mt-5">
            {isAuth && firstChat && <Link href={`/chats/${firstChat.id}`}><Button>Go to chats <ArrowRight className='ml-2' /></Button></Link>}
            <div className='ml-3'><SubscriptionButton isPro={isPro}/></div>
          </div>
          {!userId && <p className='text-lg mt-5'>Join now to unlock your full potential</p>}
          <div className='mt-4 max-w-sm w-full'>
            {isAuth ? (<FileUpload />) : <Link href={'/sign-in'}><Button>Login to get started <LogIn className='w-5 h-5 ml-2' /></Button></Link>}
          </div>
        </div>
      </div>
    </div>
  )
}
