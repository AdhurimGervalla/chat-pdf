"use client";
import React from "react";
import { useChat } from "ai/react";
import MessageList from "./MessageList/MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ChatInputComponent from "./ChatInputComponent";
import { DrizzleWorkspace } from "@/lib/db/schema";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import { Metadata } from "@/lib/types/types";
import { debounce } from "lodash";
import ContextSearchResults from "./ContextSearchResults";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import FavoriteWorkspacesList from "./FavoriteWorkspacesList";
import LoaderSpinner from "./LoaderSpinner";
import { ChatsContext } from "@/context/ChatsContext";


const ChatComponent = ({chatId}: {chatId: string}) => {
  const router = useRouter();
  const [loadingMessages, setLoadingMessages] = React.useState<boolean>(true);
  const [scrollDown, setScrollDown] = React.useState<boolean>(true);
  const [searchResults, setSearchResults] = React.useState<Metadata[]>([]);
  const [searching, setSearching] = React.useState<boolean>(false);
  const { workspace } = React.useContext(WorkspaceContext);
  const { refetch: refetchChats } = React.useContext(ChatsContext);

  const { data, refetch } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await axios.post("/api/get-messages", { chatId });
      setLoadingMessages(false);
      return res.data;
    },
  });

  const fetchApiWithDebounce = React.useCallback(
    debounce(async (value: string, currentWorkspace: DrizzleWorkspace) => {
      setSearching(true);
      const res = await axios.post<Metadata[]>(
        "/api/search-through-pinecone-namespace",
        {
          message: value,
          currentWorkspace: currentWorkspace,
        }
      );
      setSearchResults(res.data);
      setSearching(false);
    }, 200),
    []
  );

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    isLoading,
    stop,
    setMessages,
  } = useChat({
    id: chatId,
    api: "/api/chat",
    body: { chatId: chatId, currentWorkspace: workspace },
    initialMessages: data,
    onResponse: async (message) => {},
    onFinish: async (message) => {
      await refetch();
      refetchChats();
    },
    onError: (e) => {
      console.error(e);
      toast.error("Your message could not be sent.");
      router.push(`/chats/${v4()}`);
    },
  });

  const handleSubmitModified = (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event);
    setSearchResults([]);
  }

  const handleInputChangeModified = (event: any) => {
    handleInputChange(event);
    if (workspace === null || event.target.value == "") return;
    fetchApiWithDebounce(event.target.value, workspace);
  };

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, scrollDown]);

  React.useEffect(() => {
    setMessages(data);
  }, [data]);

  return (
    <div
      className="flex flex-col w-full h-full overflow-y-scroll"
      id="message-container"
    >
      {loadingMessages ? (
        <LoaderSpinner />
      ) : messages.length === 0 ? (
        <FavoriteWorkspacesList />
      ) : (
        <div className="max-w-4xl  w-full mx-auto relative">
          <MessageList
            messages={messages}
            refetch={refetch}
            isLoading={isLoading}
          />
        </div>
      )}

      {(input.length > 0 && (searchResults.length > 0 || searching)) && <ContextSearchResults searchResults={searchResults} isSearching={searching} setSearchResults={setSearchResults} />}
      <ChatInput
        handleSubmit={handleSubmitModified}
        handleInputChange={handleInputChangeModified}
        isLoading={isLoading}
        input={input}
        stop={stop}
      />
    </div>
  );
};

interface ChatInputProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  input: string;
  stop: () => void;
}

const ChatInput = ({
  handleSubmit,
  handleInputChange,
  isLoading,
  input,
  stop,
}: ChatInputProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className={
        "sticky bottom-0 inset-x-0 pt-10 pb-5 w-full max-w-4xl mx-auto mt-auto"
      }
    >
      <div className="flex">
        <ChatInputComponent
          handleSubmit={handleSubmit}
          stopCb={stop}
          value={input}
          isLoading={isLoading}
          onChange={handleInputChange}
          placeholder={"How can i help you?"}
        />
      </div>
    </form>
  );
};

// Display name for React DevTools
ChatInput.displayName = "ChatInput";

export default ChatComponent;
