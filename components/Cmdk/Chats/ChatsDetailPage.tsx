import React from 'react'
import { ChatTitle } from '../PageTitle';
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema';
import { cn, isCurrentChat } from '@/lib/utils';
import ListItem from '../ListItem';
import { useRouter } from 'next/navigation';
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid';
import { Bookmark, LinkIcon, PlusCircle, Save, Trash } from 'lucide-react';
import { Command, CommandItem } from 'cmdk';
import toast from 'react-hot-toast';
import { v4 } from "uuid";
import axios from 'axios';
import { useWorkspacesContext } from '@/context/WorkspacesContext';

type Props = {
    chatId: string;
    refetchChats: any;
    selectedChat: DrizzleChat;
    handleSaveToWorkspace: any;
    setPages: any;
    chats: DrizzleChat[];
    handeOnSelect: any;
    inputRef: any;
}

const ChatsDetailPage = ({chatId, refetchChats, handleSaveToWorkspace, selectedChat, setPages, chats, handeOnSelect, inputRef}: Props) => {
    const router = useRouter();
    const [saveToWorkspaceMode, setSaveToWorkspaceMode] = React.useState(false)
    const { workspaces } = useWorkspacesContext();

    const handleWorkspaceSelect = () => {
        setSaveToWorkspaceMode(!saveToWorkspaceMode);
        if (inputRef.current) {
            inputRef.current.focus();
          }
    }

    const deleteChat = async (idOfChat: string, chats: DrizzleChat[]) => {
        try {
            await axios.post(`/api/delete-chat`, {
                chatId: idOfChat,
                workspaceId: chats.filter(chat => chat.id === idOfChat)[0].workspaceId
              });
            refetchChats();
            if (isCurrentChat(idOfChat, chatId)) {
                router.push(`/chats/${v4()}`);
            } else {
                setPages((pages: any) => pages.slice(0, -1));
            }
          } catch (error) {
            console.log(error);
          }
    }
    

    const startDelete = (chatId: string, chats: DrizzleChat[]) => {
        toast.promise(deleteChat(chatId, chats), {
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
            refetchChats();
            setPages([]);
        } catch (error) {
            console.log(error);
        }
    }  

  return (
        <>
            {selectedChat && <ChatTitle text={selectedChat.title || ''} chatId={selectedChat.id as string} refetchChats={refetchChats} />}
            {!saveToWorkspaceMode && <>
                <ListItem cnObjects={[{'opacity-50 cursor-default hover:bg-green-700 dark:hover:bg-slate-700': isCurrentChat(selectedChat?.id, chatId)}]} onSelect={() => {
                    if (!isCurrentChat(selectedChat.id, chatId)) {
                        router.push(`/chats/${selectedChat.id}`);
                    }
                }}>
                    <ChatBubbleLeftIcon className='w-4 h-4' /> Open chat
                </ListItem>
                <ListItem onSelect={() => toggleBookmark(selectedChat)}>
                    <Bookmark className='w-4 h-4' color={selectedChat.bookmarked ? 'green' : 'black'} /> {selectedChat.bookmarked ? 'Remove Bookmark' : 'Bookmark chat'}
                </ListItem>
                <ListItem onSelect={() => startDelete(selectedChat.id, chats)}>
                    <Trash className='w-4 h-4' /> Delete Chat
                </ListItem>
                <ListItem onSelect={() => handeOnSelect(['relatedChats', 0])}>
                    <LinkIcon className='w-4 h-4' /> Show related chats
                </ListItem>
            </>}
            {selectedChat.workspaceId === 0 && <ListItem onSelect={handleWorkspaceSelect} >
                <PlusCircle className='w-4 h-4' /> Add to workspace
            </ListItem>}
            <Command.Group className='mt-5'>
                <CommandItem className='inline'>Workspace:</CommandItem>
                {saveToWorkspaceMode && (
                    <>
                        {workspaces.map((workspace) => (
                            <ListItem onSelect={() => handleSaveToWorkspace(workspace)}
                                key={workspace.id}>
                                    {workspace.name}<Save className='w-4 h-4 ml-auto' />
                            </ListItem>
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

export default ChatsDetailPage