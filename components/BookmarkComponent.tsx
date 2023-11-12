import { DrizzleChat } from '@/lib/db/schema';
import axios from 'axios';
import { Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    chat: DrizzleChat;
}

const BookmarkComponent = ({chat}: Props) => {
    const router = useRouter();
    const toggleBookmark = async (chat: DrizzleChat) => {
        try {
            const res = await axios.post(`/api/bookmark`, {
                chat            
            });
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }    

    return (
    <div className={`block p-2 flex items-center justify-between ${chat.bookmarked ? 'text-green-600':''} hover:text-blue-600`} onClick={() => toggleBookmark(chat)}>
        {chat.bookmarked ? 'Remove bookmarks' : 'Bookmark'} <Bookmark className='w-4 h-4' />
    </div>
    )
}

export default BookmarkComponent