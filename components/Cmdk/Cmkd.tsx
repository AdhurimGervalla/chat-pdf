"use client";
import React from "react";
import { Command } from "cmdk";
import { DrizzleChat, DrizzleWorkspace } from "@/lib/db/schema";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import WorkspaceChatsPage from "./Workspaces/WorkspaceChatsPage";
import NewWorkspace from "./Workspaces/NewWorkspace";
import WorkspaceList from "./Workspaces/WorkspaceList";
import ChatsList from "./Chats/ChatsList";
import Overview from "./Overview";
import ChatsDetailPage from "./Chats/ChatsDetailPage";
import { CmdkOpenStateContext } from "@/context/CmdKOpenStateContext";
import { useQuery } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useWorkspacesContext } from "@/context/WorkspacesContext";
import { useChatsContext } from "@/context/ChatsContext";

type Props = {
  chatId: string;
};

export type Page = [string, number | string];

const Cmkd = ({chatId}: Props) => {
  const router = useRouter();
  const newChatId = v4();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { open, setOpen } = React.useContext(CmdkOpenStateContext);
  const { workspaces, refetch } = useWorkspacesContext();
  const { chats, refetch: refetchChats } = useChatsContext();
  const [search, setSearch] = React.useState("");
  const [pages, setPages] = React.useState<Page[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<DrizzleChat | null>(
    null
  );
  const [disableDialogInput, setDisableDialogInput] =
    React.useState<boolean>(false);
  const page = pages[pages.length - 1];

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    setOpen(false);
    const down = (e: any) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open: boolean) => !open);
        reset();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const reset = () => {
    setPages((pages) => pages.slice(0, -1));
    setSearch("");
    setSelectedChat(null);
    setDisableDialogInput(false);
  };

  const handleValueChange = (value: string) => {
    setSearch(value);
  };

  const handeOnSelect = (page: Page) => {
    setPages([...pages, page]);
    if (inputRef.current) {
      inputRef.current.focus();
      setSearch("");
    }
  };

  const handleCreateWorkspace = (page: Page) => {
    setDisableDialogInput(!disableDialogInput);
    setPages([...pages, page]);
  };

  const handleDetailView = (chat: DrizzleChat) => {
    setPages([...pages, ["chatsDetailPage", chat.id]]);
    setSelectedChat(chat);
    if (inputRef.current) {
      inputRef.current.focus();
      setSearch("");
    }
  };

  const handleNewChat = () => {
    router.push(`/chats/${newChatId}`);
  };

  const handleSaveToWorkspace = async (workspace: DrizzleWorkspace) => {
    if (workspace && selectedChat) {
      try {
        toast
          .promise(
            axios.post(`/api/save-chat-to-workspace`, {
              workspace,
              chat: selectedChat,
            }),
            {
              loading: "Saving chat to workspace...",
              success: "Chat saved to workspace",
              error: "Couldn't save chat to workspace",
            }
          )
          .then(() => {
            refetchChats();
            refetch();
            reset();
          });
      } catch (error: any) {
        // check if error status is 409
        // if so, then set workspaceName to ''
        // else, console.log(error)
        if (error.response.status === 409) {
          toast.error("Chat already exists in this workspace");
        }
      }
    }
  };

  const getWorkspaceById = (
    id: number,
    workspaces: DrizzleWorkspace[]
  ): DrizzleWorkspace => {
    return workspaces.filter((workspace) => workspace.id === id)[0];
  };

  return (
    <>
      {open && (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black opacity-30 dark:opacity-70 z-10"></div>
      )}
      {chats && workspaces && (
        <Command.Dialog
          onKeyDown={(e) => {
            // Escape goes to previous page
            // Backspace goes to previous page when search is empty
            if (
              e.key === "Escape" ||
              (e.key === "Backspace" && !search && !disableDialogInput)
            ) {
              e.preventDefault();
              if (pages.length === 0) {
                setOpen(false);
              }
              reset();
            }
          }}
          className="shadow-3xl fixed z-20 top-1/2 -translate-y-1/2 left-5 right-5 max-h-[500px] h-full overflow-y-scroll bg-white dark:bg-slate-900 rounded-lg opacity-[0.98] sm:w-[500px] sm:left-1/2 sm:-translate-x-1/2"
          open={open}
          onOpenChange={setOpen}
          label="Global Command Menu"
        >
          <Command.Input
            disabled={disableDialogInput}
            placeholder={
              !disableDialogInput ? "search for chats and workspaces" : ""
            }
            ref={inputRef}
            value={search}
            onValueChange={handleValueChange}
            className="px-5 py-3 sticky top-0 w-full text-slate-900 dark:bg-slate-900 opacity-100 border-0 focus:ring-0 focus:ring-offset-0 dark:text-white shadow-inner"
          />
          <Command.List className="p-5">
            {!page && (
              <Overview
                handeOnSelect={handeOnSelect}
                handleCreateWorkspace={handleCreateWorkspace}
                handleNewChat={handleNewChat}
                page={page}
                handleDetailView={handleDetailView}
                chatId={chatId as string}
              />
            )}

            {page && page[0] === "chats" && (
              <ChatsList
                chats={chats}
                currentChatId={chatId as string}
                handleDetailView={handleDetailView}
              />
            )}

            {page && page[0] === "chatsDetailPage" && selectedChat && (
              <ChatsDetailPage
                chatId={chatId as string}
                refetchChats={refetchChats}
                handleSaveToWorkspace={handleSaveToWorkspace}
                selectedChat={selectedChat}
                setPages={setPages}
                chats={chats}
                inputRef={inputRef}
                handeOnSelect={handeOnSelect}
              />
            )}

            {page && page[0] === "workspaces" && (
              <WorkspaceList
                handeOnSelect={handeOnSelect}
              />
            )}
            {page && page[0] === "workspaceDetail" && (
              <>
                <WorkspaceChatsPage
                  workspace={getWorkspaceById(page[1] as number, workspaces)}
                />
              </>
            )}
            {page && page[0] === "newWorkspace" && (
              <NewWorkspace
                refetchWorkspaces={refetch}
                reset={reset}
              />
            )}
          </Command.List>
        </Command.Dialog>
      )}
    </>
  );
};

export default Cmkd;
