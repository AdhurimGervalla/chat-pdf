import { UserButton, auth } from '@clerk/nextjs'
import { checkSubscription } from '@/lib/subscription';
import { getFirstChat } from '@/lib/db/index';
import { v4 } from "uuid";
import ChatePageComponent from '@/components/ChatePageComponent';
import LoginPage from '@/components/LoginPage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function Home() {
  const {userId} = await auth();

  let chatId;
  if (userId) {
    // firstChat = await getFirstChat(userId);
    // at this point, we have a userId and a chatId but we need to create a chatId
    chatId = v4();
    redirect(`/chats/${chatId}`);
  }

  return userId && chatId ? 'you are getting redirected' : <LoginPage />;
}
