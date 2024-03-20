'use client';
import { useChatsContext } from "@/context/ChatsContext";
import { useWorkspacesContext } from "@/context/WorkspacesContext";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    const { refetch } = useWorkspacesContext();
    const { refetch: refetchChats } = useChatsContext();

    React.useEffect(() => {
        refetch();
        refetchChats();
    }, [])
    return <>{children}</>
  }