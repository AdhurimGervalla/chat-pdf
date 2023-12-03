/*import { DrizzleChat } from '@/lib/db/schema'
import React from 'react'
import { Command, CommandItem } from 'cmdk';
import PageTitle from './PageTitle';
import ListItem from './ListItem';
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid';
import { Bookmark, LinkIcon, PlusCircle, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {Page} from './Cmkd';

type Props = {
    chat: DrizzleChat;
    setPages: any;
    pages : Page[];
}

const ChatPage = ({chat, setPages, pages}: Props) => {
    const router = useRouter();
    const { chatId } = useParams();
    const trimChatTitle = (title: string) => {
        if (title.length > 50) {
            return title.slice(0, 50) + '...';
        }
        return title;
    }

    const toggleBookmark = async (chat: DrizzleChat) => {
        try {
            const res = await axios.post(`/api/bookmark`, {
                chat            
            });
            router.refresh();
            setPages([]);
        } catch (error) {
            console.log(error);
        }
    }    
    
    const startDelete = (chatId: string) => {
        toast.promise(deleteChat(), {
            loading: 'Deleting chat...',
            success: 'Chat deleted',
            error: 'Couldn\'t delete chat'
        });
    }

    const deleteChat = async () => {
        try {
            await axios.post(`/api/delete-chat`, {
                chatId: chat.id,
                workspaceId: chat.workspaceId
              });
            router.refresh();
            if (isCurrentChat(chat.id)) {
                router.push(`/`);
            } else {
                setPages((pages: Page) => pages.slice(0, -1));
            }
          } catch (error) {
            console.log(error);
          }
    
    }

    const isCurrentChat = (id: string) => {
        return id === chatId;
    }
    
    return (
    <>
        <PageTitle>{chat.title && trimChatTitle(chat.title)}</PageTitle>
        <Command.List>
            <ListItem cnObjects={[{'opacity-50 cursor-default hover:bg-green-700 dark:hover:bg-slate-700': true}]} onSelect={() => router.push(`/chats/${chat.id}`)}>
                <ChatBubbleLeftIcon className='w-4 h-4' /> Open chat
            </ListItem>
            <ListItem cnObjects={[{'bg-green-500 dark:bg-slate-800': chat.bookmarked}]} onSelect={() => toggleBookmark(chat)}>
                <Bookmark className='w-4 h-4' color={chat.bookmarked ? 'green' : 'white'} /> {chat.bookmarked ? 'Remove Bookmark' : 'Bookmark chat'}
            </ListItem>
            <ListItem onSelect={() => startDelete(chat.id)}>
                <Trash className='w-4 h-4' /> Delete Chat
            </ListItem>
            <ListItem onSelect={() => handeOnSelect(['relatedChats', 0])}>
                <LinkIcon className='w-4 h-4' /> Show related chats
            </ListItem>
        </Command.List>
        {chat.workspaceId === 0 && <ListItem onSelect={handleWorkspaceSelect}>
            <PlusCircle className='w-4 h-4' /> Add to workspace
        </ListItem>}
        <Command.Group className='mt-5'>
            <CommandItem className='inline'>Workspace:</CommandItem>
            {saveToWorkspaceMode && (
                <>
                    {workspaces.map((workspace) => (
                        <Command.Item className={CommandItemClasses} onSelect={() => handleSaveToWorkspace(workspace)}
                            key={workspace.id}>
                                {workspace.name}<Save className='w-4 h-4 ml-auto' />
                        </Command.Item>
                    ))}
                </>
            )}   
            {workspaces.map((workspace) => (
                <CommandItem key={workspace.id} className={cn('hidden underline ml-3', {'inline cursor-pointer': workspace.id === selectedChat.workspaceId})} onSelect={() => handeOnSelect(['workspaceDetail', workspace.id])} >{workspace.name}</CommandItem>
            ))}
        </Command.Group>
    </>
  )
}

export default ChatPage*/