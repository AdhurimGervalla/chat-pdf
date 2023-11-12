import { UserButton, auth } from '@clerk/nextjs'
import { checkSubscription } from '@/lib/subscription';
import { getFirstChat } from '@/lib/db/index';
import { v4 } from "uuid";
import { redirect } from 'next/navigation'
import ChatePageComponent from '@/components/ChatePageComponent';
import LoginPage from '@/components/LoginPage';

export default async function Home() {
  const {userId} = await auth();


  let chatId;
  if (userId) {
    //firstChat = await getFirstChat(userId);
    // at this point, we have a userId and a chatId but we need to create a chatId
    chatId = v4();
  }


  return userId && chatId ? <ChatePageComponent userId={userId} chatId={chatId} isNewChat={true} /> : <LoginPage />;
}
