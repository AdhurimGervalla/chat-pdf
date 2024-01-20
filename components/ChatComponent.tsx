"use client";
import React from "react";
import { useChat } from "ai/react";
import { Loader2 } from "lucide-react";
import MessageList from "./MessageList/MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ChatInputComponent from "./ChatInputComponent";
import { DrizzleChat, DrizzleWorkspace } from "@/lib/db/schema";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import Workspaces from "./Workspaces";
import { Metadata, WorkspaceWithRole } from "@/lib/types/types";
import { debounce } from "lodash";
import ContextSearchResults from "./ContextSearchResults";

type Props = {
  chatId: string;
  workspaces?: WorkspaceWithRole[];
  refetchChats: any;
  allChats?: DrizzleChat[];
};

const ChatComponent = ({
  chatId,
  workspaces,
  allChats,
  refetchChats,
}: Props) => {
  const [loadingMessages, setLoadingMessages] = React.useState<boolean>(true);
  const [scrollDown, setScrollDown] = React.useState<boolean>(true);
  const [searchResults, setSearchResults] = React.useState<Metadata[]>([]);
  const [searching, setSearching] = React.useState<boolean>(false);
  const { workspace } = React.useContext(WorkspaceContext);

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
    body: { chatId, currentWorkspace: workspace },
    initialMessages: data,
    onResponse: async (message) => {},
    onFinish: async (message) => {
      await refetch();
      refetchChats();
    },
    onError: (e) => {
      console.log(e);
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

  console.log("input", input.length);

  return (
    <div
      className="flex flex-col w-full h-full overflow-y-scroll"
      id="message-container"
    >
      {loadingMessages || workspaces === undefined ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="w-[50px] h-[50px] animate-spin" />
        </div>
      ) : messages.length === 0 && workspaces ? (
        <Workspaces workspaces={workspaces} chatId={chatId} />
      ) : (
        <div className="max-w-4xl  w-full mx-auto relative">
          <MessageList
            messages={messages}
            refetch={refetch}
            isLoading={isLoading}
            allChats={allChats}
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
