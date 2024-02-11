"use client";
import React from "react";
import ChatComponent from "./ChatComponent";
import {
  DrizzleChat,
  DrizzleWorkspace,
  messages as _messages,
} from "@/lib/db/schema";
import Cmkd from "./Cmdk/Cmkd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import HeaderArea from "./HeaderArea";
import { WorkspaceWithRole } from "@/lib/types/types";
import { Suspense } from "react";
type Props = {
  chatId: string;
};

const ChatePageComponent = ({ chatId }: Props) => {
  const {
    data: workspaces,
    refetch: refetchWorkspaces,
    isLoading: isLoadingWorkspaces,
  } = useQuery<WorkspaceWithRole[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await axios.get("/api/get-workspaces");
      let data = [];
      if (res.data.workspaces) {
        data = res.data.workspaces;
      }
      return data;
    },
  });

  const {
    data: chats,
    refetch: refetchChats,
    isLoading: isLoadingChats,
  } = useQuery<DrizzleChat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.post("/api/get-chats");
      return res.data;
    },
  });

  return (
    <>
      <HeaderArea />
      <>
        <Cmkd
          chats={chats}
          workspaces={workspaces}
          refetchChats={refetchChats}
          refetchWorkspaces={refetchWorkspaces}
        />
        <div className="flex w-full max-h-screen overflow-hidden border-x-[15px] border-x-transparent">
          <div className="w-full flex flex-col relative h-[100dvh] overflow-scroll pt-[65px]">
            <ChatComponent
              chatId={chatId}
              allChats={chats}
              workspaces={workspaces}
              refetchChats={refetchChats}
            />
          </div>
        </div>
      </>
    </>
  );
};

export default ChatePageComponent;
