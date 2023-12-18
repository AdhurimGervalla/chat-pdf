import React, { useContext } from "react";

interface MessagesContext {
    messages: any[];
    setMessages: any;
    loadingMessages: boolean;
    setLoadingMessages: any;
    refetch: any;
}

export const MessagesContext = React.createContext<MessagesContext>({
    messages: [],
    setMessages: () => {},
    loadingMessages: true,
    setLoadingMessages: () => {},
    refetch: () => {},
});

export const useMessagesContext = () =>  useContext(MessagesContext);