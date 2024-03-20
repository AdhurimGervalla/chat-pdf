import { Command } from "cmdk";
import { ArrowRight, PlusCircle, Search } from "lucide-react";
import React from "react";
import ListItem from "./ListItem";
import { DrizzleChat } from "@/lib/db/schema";

type Props = {
  handeOnSelect: any;
  handleCreateWorkspace: any;
  handleNewChat: any;
  page: string;
  chats: DrizzleChat[];
  chatId: string;
  handleDetailView: any;
};

const Overview = ({
  handeOnSelect,
  handleCreateWorkspace,
  handleNewChat,
  page,
  chats,
  chatId,
  handleDetailView,
}: Props) => {
  const chatExists = (chats: DrizzleChat[], chatId: string): boolean => {
    return chats.filter((chat) => chat.id === chatId).length > 0;
  };

  return (
    <>
      <Command.Group className="mb-6">
        <small>Chats</small>
        {chatExists(chats, chatId as string) && (
          <ListItem
            onSelect={() => {
              const chat = chats.filter((chat) => chat.id === chatId)[0];
              if (chat) {
                handleDetailView(chat);
              }
            }}
          >
            <ArrowRight className="w-4 h-4" />
            Jump to active chat
          </ListItem>
        )}
        <ListItem
          onSelect={() => handeOnSelect(["chats", 0])}
          cnObjects={[{ "bg-green-700 text-white": page === "chats" }]}
        >
          <Search className="w-4 h-4" />
          Search chats
        </ListItem>
        {chatExists(chats, chatId as string) && (
          <ListItem onSelect={() => handleNewChat()}>
            <PlusCircle className="w-4 h-4" />
            New chat
          </ListItem>
        )}
      </Command.Group>
      <Command.Group>
        <small>Workspaces</small>
        <ListItem onSelect={() => handeOnSelect(["workspaces", 0])}>
          <Search className="w-4 h-4" />
          My workspaces
        </ListItem>
        <ListItem onSelect={() => handleCreateWorkspace(["newWorkspace", 0])}>
          <PlusCircle className="w-4 h-4" />
          New Workspace
        </ListItem>
      </Command.Group>
    </>
  );
};

export default Overview;
