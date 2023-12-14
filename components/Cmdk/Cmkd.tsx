'use client';
import React from 'react'
import { Command, CommandItem } from 'cmdk';
import { DrizzleChat, DrizzleWorkspace } from '@/lib/db/schema';
import { v4 } from "uuid";
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Bookmark, LinkIcon, List, PlusCircle, Save, Search, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid';
import { Button } from '../ui/button';
import WorkspaceChatsPage from './WorkspaceChatsPage';
import ListItem from './ListItem';
import { type } from 'os';
import { ChatTitle, WorkspaceTitle } from './PageTitle';

type Props = {
    chats?: DrizzleChat[];
    workspaces?: DrizzleWorkspace[];
    refetchChats: any;
    refetchWorkspaces: any;
}

export type Page = [string, number|string];

const Cmkd = ({chats, refetchChats, workspaces, refetchWorkspaces}: Props) => {
    const router = useRouter();
    const { chatId } = useParams();

    const inputRef = React.useRef<HTMLInputElement>(null);
    const workspaceNameInputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('')        
    const [pages, setPages] = React.useState<Page[]>([])
    const [selectedChat, setSelectedChat] = React.useState<DrizzleChat | null>(null)
    const [saveToWorkspaceMode, setSaveToWorkspaceMode] = React.useState(false)
    const [workspaceName, setWorkspaceName] = React.useState<string>('');
    const [disableDialogInput, setDisableDialogInput] = React.useState<boolean>(false);
    const page = pages[pages.length - 1]

    // Toggle the menu when ⌘K is pressed
    React.useEffect(() => {
        const down = (e: any) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                console.log('pressed');
                e.preventDefault();
                setOpen((open) => !open);
                reset();
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, []);

    React.useEffect(() => {
        console.log(pages);
    }, [pages]);

    const reset = () => {
        setPages((pages) => pages.slice(0, -1));
        setSearch('');
        setWorkspaceName('');
        setSelectedChat(null);
        setSaveToWorkspaceMode(false);
        setDisableDialogInput(false);
    }

    const CommandItemClasses = 'mt-3 first:mt-0 cursor-pointer flex flex-row items-center gap-2 bg-green-200 hover:bg-green-600 hover:text-white dark:bg-slate-700 py-1 px-3 rounded-lg dark:hover:bg-slate-800 transition-colors';

    const handleValueChange = (value: string) => {
        setSearch(value);
    }

    const handleWorkspaceSelect = () => {
        setSaveToWorkspaceMode(!saveToWorkspaceMode);
        if (inputRef.current) {
            inputRef.current.focus();
          }
    }

    const handeOnSelect = (page: Page) => {
        setPages([...pages, page]);
        if (inputRef.current) {
            inputRef.current.focus();
          }
    }

    const handleCreateWorkspace = (page: Page) => {
        setDisableDialogInput(!disableDialogInput);
        setPages([...pages, page]);
        setTimeout(() => {
            if (workspaceNameInputRef.current) {
                workspaceNameInputRef.current.focus();
            }
        }, 100);
    }

    const handleDetailView = (chat: DrizzleChat) => {
        setPages([...pages, ['chatsDetailPage', chat.id]]);
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

    const deleteChat = async (idOfChat: string, chats: DrizzleChat[]) => {
        try {
            await axios.post(`/api/delete-chat`, {
                chatId: idOfChat,
                workspaceId: chats.filter(chat => chat.id === idOfChat)[0].workspaceId
              });
            refetchChats();
            console.log('chatId', idOfChat);
            if (isCurrentChat(idOfChat)) {
                router.push(`/chats/${v4()}`);
            } else {
                setPages((pages) => pages.slice(0, -1));
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


    const isCurrentChat = (id: string) => {
        return id === chatId;
    }


    const handleSaveToWorkspace = async (workspace: DrizzleWorkspace) => {
        if (workspace && selectedChat) {
          try {
            toast.promise(axios.post(`/api/save-chat-to-workspace`, {
                workspace,
                chat: selectedChat
              }), {
                loading: 'Saving chat to workspace...',
                success: 'Chat saved to workspace',
                error: 'Couldn\'t save chat to workspace'
            }).then(() => {
                refetchChats();
                refetchWorkspaces();
                reset();
            });
          } catch (error: any) {
              // check if error status is 409
              // if so, then set workspaceName to ''
              // else, console.log(error)
              if (error.response.status === 409) {
                toast.error('Chat already exists in this workspace');
              }
          }
        }
    }

    const createWorkspace = async () => {
        if (workspaceName.length > 0) {
          try {
            toast.promise(axios.post(`/api/create-workspace`, {
                workspaceName
              }), {
                loading: 'Creating new workspace...',
                success: 'Saved workspace',
                error: 'Couldn\'t save workspace'
            }).then(() => {
                console.log('refreshing');
                refetchWorkspaces();
                reset();
            });
          } catch (error: any) {
              // check if error status is 409
              // if so, then set workspaceName to ''
              // else, console.log(error)
              if (error.response.status === 409) {
                toast.error('Chat already exists in this workspace');
              }
          }
        }
    }


    
    const getWorkspaceById = (id: number, workspaces: DrizzleWorkspace[]): DrizzleWorkspace => {
        return workspaces.filter(workspace => workspace.id === id)[0];
    }

    const chatExists = (chats: DrizzleChat[], chatId: string): boolean => {
        return chats.filter(chat => chat.id === chatId).length > 0;
    }
    
    return (
        <>
            {open && <div className='fixed left-0 right-0 top-0 bottom-0 bg-black opacity-30 dark:opacity-70 z-10'></div>}
            {chats && workspaces &&
                        <Command.Dialog onKeyDown={(e) => {
                            // Escape goes to previous page
                            // Backspace goes to previous page when search is empty
                            if (e.key === 'Escape' || (e.key === 'Backspace' && !search && !disableDialogInput)) {
                            e.preventDefault();
                            reset();
                            }
                        }} className='shadow-3xl fixed z-20 top-1/2 -translate-y-1/2 left-5 right-5 max-h-[500px] h-full overflow-y-scroll bg-white dark:bg-slate-900 rounded-lg opacity-[0.98] sm:w-[500px] sm:left-1/2 sm:-translate-x-1/2' open={open} onOpenChange={setOpen} label="Global Command Menu">
                            <Command.Input disabled={disableDialogInput} placeholder={!disableDialogInput ? 'search for chats and workspaces' : ''} ref={inputRef} value={search} onValueChange={handleValueChange} className='px-5 py-3 sticky top-0 w-full text-slate-900 dark:bg-slate-900 opacity-100 border-0 focus:ring-0 focus:ring-offset-0 dark:text-white shadow-inner' />
                            <Command.List className='p-5'>
                                {!page && (
                                    <>
                                        <Command.Group className='mb-6'>
                                                <small>Chats</small>
                                                {chatExists(chats, chatId as string) && <Command.Item className={CommandItemClasses} onSelect={() => {
                                                    const chat = chats.filter(chat => chat.id === chatId)[0];
                                                    if (chat) {
                                                        handleDetailView(chat);
                                                    }
                                                }}><ArrowRight className='w-4 h-4' />Jump to active chat</Command.Item>}
                                                <ListItem onSelect={() => handeOnSelect(['chats', 0])} cnObjects={[{'bg-green-700 text-white': page === 'chats'}]}><Search className='w-4 h-4' />Search chats</ListItem>
                                                {chatExists(chats, chatId as string) && <ListItem onSelect={() => handleNewChat()}><PlusCircle className='w-4 h-4' />New chat</ListItem>}
                                        </Command.Group>
                                        <Command.Group>
                                                <small>Workspaces</small>
                                                <ListItem onSelect={() => handeOnSelect(['workspaces', 0])}><Search className='w-4 h-4' />Search workspaces</ListItem>
                                                <ListItem onSelect={() => handleCreateWorkspace(['newWorkspace', 0])}><PlusCircle className='w-4 h-4' />New Workspace</ListItem>
                                        </Command.Group>
                                    </>
                                )}
            
                                {page && page[0] === 'chats' && (
                                    <>
                                        {chats.map((chat) => (
                                            <ListItem onSelect={() => handleDetailView(chat)} cnObjects={[{'bg-green-700 text-white': isCurrentChat(chat.id)}]} key={chat.id}>
                                                {chat.bookmarked && <Bookmark className='w-4 h-4' color={isCurrentChat(chat.id) ? 'white': 'green'} />} {chat.title && trimChatTitle(chat.title)}
                                            </ListItem>
                                        ))}
                                    </>
                                )}
            
                                {page && page[0] === 'chatsDetailPage' && selectedChat && (
                                    <>
                                        {chatId && <ChatTitle text={selectedChat.title || ''} chatId={chatId as string} refetchChats={refetchChats} />}
                                        {!saveToWorkspaceMode && <>
                                            <ListItem cnObjects={[{'opacity-50 cursor-default hover:bg-green-700 dark:hover:bg-slate-700': isCurrentChat(selectedChat?.id)}]} onSelect={() => {
                                                if (!isCurrentChat(selectedChat.id)) {
                                                    router.push(`/chats/${selectedChat.id}`);
                                                }
                                            }}>
                                                <ChatBubbleLeftIcon className='w-4 h-4' /> Open chat
                                            </ListItem>
                                            <ListItem cnObjects={[{'bg-green-500 dark:bg-slate-800': selectedChat.bookmarked}]} onSelect={() => toggleBookmark(selectedChat)}>
                                                <Bookmark className='w-4 h-4' color={selectedChat.bookmarked ? 'green' : 'white'} /> {selectedChat.bookmarked ? 'Remove Bookmark' : 'Bookmark chat'}
                                            </ListItem>
                                            <ListItem onSelect={() => startDelete(selectedChat.id, chats)}>
                                                <Trash className='w-4 h-4' /> Delete Chat
                                            </ListItem>
                                            <ListItem onSelect={() => handeOnSelect(['relatedChats', 0])}>
                                                <LinkIcon className='w-4 h-4' /> Show related chats
                                            </ListItem>
                                        </>}
                                        {selectedChat.workspaceId === 0 && <Command.Item onSelect={handleWorkspaceSelect} className={CommandItemClasses}>
                                            <PlusCircle className='w-4 h-4' /> Add to workspace
                                        </Command.Item>}
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
                                )}
            
                                {page && page[0] === 'workspaces' && (
                                    <>
                                        {workspaces.map((workspace) => (
                                            <ListItem onSelect={() => handeOnSelect(['workspaceDetail', workspace.id])} key={workspace.id}>
                                                <List className='w-4 h-4' /> {workspace.name}
                                            </ListItem>
                                        ))}
                                    </>
                                )}
                                {page && page[0] === 'workspaceDetail' && (
                                    <>
                                        <WorkspaceChatsPage workspace={getWorkspaceById(page[1] as number, workspaces)} />
                                    </>
                                )}
                                {page && page[0] === 'newWorkspace' && (
                                    <Command.Group className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max'>
                                        <div className='flex items-center justify-center'>
                                            <input
                                            ref={workspaceNameInputRef}
                                            onChange={(e) => setWorkspaceName(e.target.value)}
                                            value={workspaceName}
                                            type="text"
                                            name="workspaceName"
                                            id="workspaceName"
                                            className="mr-3 rounded-md border-0 py-1.5 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6"
                                            placeholder="enter a name"
                                            />
                                            <Button className='h-[30px]' onClick={() => createWorkspace()}><Save className='w-4 h-4 mr-2' /> Save</Button>
                                            </div>
            
                                    </Command.Group>
                                )}                
                            </Command.List>
                        </Command.Dialog>
            }

        </>

    )
}

export default Cmkd;