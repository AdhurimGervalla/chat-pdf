'use client'
import { DrizzleChat } from '@/lib/db/schema';
import React from 'react'
import ChatSettings from './ChatSettings';
import ToggleBookmarkedComponent from './ToogleBookmarkedComponent';
import Link from 'next/link';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import CreateNewChatButton from './CreateNewChatButton';

type Props = {
    chats: DrizzleChat[];
    chatId: string;
    isPro: boolean;
}

const ChatListComponent = ({chats, chatId, isPro}: Props) => {
    const router = useRouter();
    const [bookmarked, setBookmarked] = React.useState(false);
    const [clientChat, setClientChat] = React.useState<DrizzleChat[]>(chats);

    React.useEffect(() => {
        if (bookmarked) {
            const _bookmarked = chats.filter((chat: DrizzleChat) => chat.bookmarked === bookmarked);
            if (_bookmarked) {
                setClientChat(_bookmarked);
            }
        } else {
            setClientChat(chats);
        }
        
    }, [bookmarked, chats]);

    return (
        <>
            <div className='grid grid-cols-2 gap-5'>
                <div>
                    <CreateNewChatButton />
                </div>
                <ToggleBookmarkedComponent bookmarked={bookmarked} setBookmarked={setBookmarked} />
            </div>
            <ul role="list" className="divide-y divide-gray-100 mt-3">
                {clientChat.length === 0 && <li className='text-center text-slate-500 dark:text-white'>No chats yet</li>}
                {clientChat.map((chat: DrizzleChat) => {
                    return <ChatSettings chat={chat} key={chat.id} currentChatId={chatId} isPro={isPro} />
                })}
            </ul>
        </>

    )
}

export default ChatListComponent