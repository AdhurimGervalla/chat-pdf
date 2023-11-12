'use client'
import { DrizzleChat } from '@/lib/db/schema';
import React from 'react'
import ChatSettings from './ChatSettings';
import ToggleBookmarkedComponent from './ToogleBookmarkedComponent';

type Props = {
    chats: DrizzleChat[];
    chatId: string;
}

const ChatListComponent = ({chats, chatId}: Props) => {
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
            <ToggleBookmarkedComponent bookmarked={bookmarked} setBookmarked={setBookmarked} />
            <ul role="list" className="divide-y divide-gray-100 mt-3">
                {clientChat.length === 0 && <li className='text-center text-slate-500'>No chats yet</li>}
                {clientChat.map((chat: DrizzleChat) => {
                    return <ChatSettings chat={chat} key={chat.id} currentChatId={chatId} />
                })}
            </ul>
        </>

    )
}

export default ChatListComponent