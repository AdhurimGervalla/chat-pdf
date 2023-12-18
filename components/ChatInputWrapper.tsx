import axios from "axios";
import ChatInputComponent from "./ChatInputComponent";
import { useParams } from 'next/navigation'
import { useQuery } from "@tanstack/react-query";
import React, { memo } from "react";
import { useChat } from "ai/react";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import { MessagesContext } from "@/context/MessagesContext";
import ChatForm from "./ChatForm";

interface ChatInputProps {
    refetchChats: any;
}

const ChatInputWraper = ({refetchChats}: ChatInputProps) => {
    const {workspace} = React.useContext(WorkspaceContext);
    const {setMessages: setMessagesInContext, setLoadingMessages} = React.useContext(MessagesContext);
    
    const {chatId} = useParams<{ chatId: string;}>()

    const {data, refetch} = useQuery({
        queryKey: ['chat', chatId],
        queryFn: async () => {
          const res = await axios.post('/api/get-messages', { chatId });
          return res.data;
        }
    });
    
    const { input, handleInputChange, handleSubmit, messages, isLoading, stop, setMessages} = useChat({
        id: chatId,
        api: '/api/chat',
        body: { chatId, currentWorkspace: workspace},
        initialMessages: data,
        onResponse: async (message) => {
        },
        onFinish: async (message) => {
        await refetch();
        refetchChats();
        },
        onError: (e) => {
        console.log(e);
        }
    });

    React.useEffect(() => {
    setMessagesInContext(messages);
    }, [messages]);
    
    React.useEffect(() => {
    if (!data) return;
    console.log('data', data);
    setMessagesInContext(data);
    setLoadingMessages(false);
    }, [data]);

    return (
      <ChatForm input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isLoading={isLoading} stop={stop} />
    );
};

export default memo(ChatInputWraper);