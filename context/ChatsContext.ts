import { DrizzleChat } from "@/lib/db/schema";
import React, { useContext } from "react";

interface ChatsContext {
    chats: DrizzleChat[];
    setChats: (chats: DrizzleChat[]) => void;
    refetch: () => void;
}

export const ChatsContext = React.createContext<ChatsContext>({
    chats: [],
    setChats: () => {},
    refetch: () => {},
});

export const useChatsContext = () =>  useContext(ChatsContext);