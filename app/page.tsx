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
import LoginPage from '@/components/LoginPage';
import StartPage from '@/components/StartPage';
import { getFirstChat } from '@/lib/db/index';

export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();

  let firstChat;
  if (userId) {
    firstChat = await getFirstChat(userId);
  }

  return (
    <div>
      {!isAuth ? <LoginPage /> : <StartPage firstChat={firstChat} isPro={isPro} />}
    </div>
  )
}
