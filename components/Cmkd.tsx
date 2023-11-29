'use client';
import React from 'react'
import { Command } from 'cmdk';
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema';
import Link from 'next/link';
import { v4 } from "uuid";
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Bookmark, LinkIcon, PlusCircle, Search, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid';

type Props = {
    chats: DrizzleChat[];
    workspaces: DrizzleWorkspace[];
}

const Cmkd = ({chats, workspaces}: Props) => {
    const router = useRouter();
    const { chatId } = useParams();
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('')        
    const [pages, setPages] = React.useState<string[]>([])
    const [selectedChat, setSelectedChat] = React.useState<DrizzleChat | null>(null)
    const page = pages[pages.length - 1]

    // Toggle the menu when ⌘K is pressed
    React.useEffect(() => {
        const down = (e: any) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setSelectedChat(null);
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, []);

    const CommandItemClasses = 'mt-3 first:mt-0 cursor-pointer flex flex-row items-center gap-2 bg-slate-700 py-1 px-3 rounded-lg hover:bg-slate-800 transition-colors';

    const handleValueChange = (value: string) => {
        console.log(value);
        setSearch(value);
    }

    const handeOnSelect = (page: string) => {
        setPages([...pages, page]);
        if (inputRef.current) {
            inputRef.current.focus();
          }
    }

    const handleDetailView = (chat: DrizzleChat) => {
        setPages([...pages, chat.id]);
        setSelectedChat(chat);
        if (inputRef.current) {
            inputRef.current.focus();
            setSearch('');
        }
    }

    const handleNewChat = () => {
        const chatId = v4();
        router.push(`/chats/${chatId}`);
    }


    const trimChatTitle = (title: string) => {
        if (title.length > 50) {
            return title.slice(0, 50) + '...';
        }
        return title;
    }

    const deleteChat = async (idOfChat: string) => {
        try {
            await axios.post(`/api/delete-chat`, {
                chatId: idOfChat
              });
            router.refresh();
            if (isCurrentChat(idOfChat)) {
                router.push(`/chats/${v4()}`);
            } else {
                setPages((pages) => pages.slice(0, -1));
            }
          } catch (error) {
            console.log(error);
          }
      }
    
    const startDelete = (chatId: string) => {
        toast.promise(deleteChat(chatId), {
            loading: 'Deleting chat...',
            success: 'Chat deleted',
            error: 'Couldn\'t delete chat'
        });
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


    const isCurrentChat = (id: string) => {
        return id === chatId;
    }

    return (
        <>
        {false && open && <div className='blur-xl fixed left-0 right-0 top-0 bottom-0 bg-black opacity-70 z-10'>

        </div>}
        <Command.Dialog onKeyDown={(e) => {
            // Escape goes to previous page
            // Backspace goes to previous page when search is empty
            if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
              e.preventDefault();
              setSelectedChat(null);
              setPages((pages) => pages.slice(0, -1));
            }
          }} className='shadow-3xl fixed z-20 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-h-[500px] h-full overflow-y-scroll bg-slate-900 rounded-lg opacity-[0.98]' open={open} onOpenChange={setOpen} label="Global Command Menu">
            <Command.Input placeholder='search for chats and workspaces' ref={inputRef} value={search} onValueChange={handleValueChange} className='px-5 py-3 sticky top-0 w-full text-slate-900 bg-slate-900 opacity-100 border-0 focus:ring-0 focus:ring-offset-0 dark:text-white' />
            <Command.List className='p-5'>
                {!page && (
                    <>
                        <Command.Group className='mb-6'>
                                <small>Chats</small>
                                {chats.filter(chat => chat.id === chatId)[0] && <Command.Item className={CommandItemClasses} onSelect={() => {
                                    const chat = chats.filter(chat => chat.id === chatId)[0];
                                    if (chat && chat.title) {
                                        handleDetailView(chat);
                                    }
                                }}><ArrowRight className='w-4 h-4' />Jump to chat</Command.Item>}
                                <Command.Item className={CommandItemClasses} onSelect={() => handeOnSelect('chats')}><Search className='w-4 h-4' />Search chats</Command.Item>
                                <Command.Item className={CommandItemClasses} onSelect={() => handleNewChat()}><PlusCircle className='w-4 h-4' />New chat</Command.Item>
                        </Command.Group>
                        <Command.Group>
                                <small>Workspaces</small>
                                <Command.Item className={CommandItemClasses} onSelect={() => handeOnSelect('workspaces')}><Search className='w-4 h-4' />Search workspaces</Command.Item>
                        </Command.Group>
                    </>
                )}

                {page === 'chats' && (
                    <>
                        {chats.map((chat) => (
                            <Command.Item onSelect={() => handleDetailView(chat)} className={cn(CommandItemClasses, {'bg-green-700': isCurrentChat(chat.id)})}
                                key={chat.id}>
                                    {chat.bookmarked && <Bookmark className='w-4 h-4' color={isCurrentChat(chat.id) ? 'white': 'green'} />} {chat.title && trimChatTitle(chat.title)}
                            </Command.Item>
                        ))}
                    </>
                )}

                {page && selectedChat && (
                    <>
                        <h3 className='text-lg mb-5'>{selectedChat.title && trimChatTitle(selectedChat.title)}</h3>
                        <Command.Item className={cn(CommandItemClasses, {'opacity-50 cursor-default hover:bg-slate-700': isCurrentChat(selectedChat?.id)})} onSelect={() => {
                            if (!isCurrentChat(selectedChat.id)) {
                                router.push(`/chats/${selectedChat.id}`);
                            }
                        }}>
                            <ChatBubbleLeftIcon className='w-4 h-4' /> Open chat
                        </Command.Item>
                        <Command.Item className={cn(CommandItemClasses, {'bg-slate-800': selectedChat.bookmarked})} onSelect={() => toggleBookmark(selectedChat)}>
                            <Bookmark className='w-4 h-4' color={selectedChat.bookmarked ? 'green' : 'white'} /> Bookmark Chat
                        </Command.Item>
                        <Command.Item className={cn(CommandItemClasses, 'hover:bg-red-500')} onSelect={() => startDelete(selectedChat.id)}>
                            <Trash className='w-4 h-4' /> Delete Chat
                        </Command.Item>
                        <Command.Item className={CommandItemClasses}>
                            <LinkIcon className='w-4 h-4' /> Show related chats
                        </Command.Item>
                        <div className='mt-5'>
                            <span>Workspace:</span>
                        {workspaces.map((workspace) => (
                                <span key={workspace.id} className={cn('hidden underline ml-3', {'inline': workspace.id === selectedChat.workspaceId})}>{workspace.name}</span>
                            ))}
                        </div>
                    </>
                )}

                {page === 'workspaces' && (
                    <>
                        {workspaces.map((workspace) => (
                            <Command.Item className={CommandItemClasses}
                                key={workspace.id}>
                                    {workspace.name}
                            </Command.Item>
                        ))}
                    </>
                )}
            </Command.List>
      </Command.Dialog>
        </>

    )
}

export default Cmkd;