'use client';
import { useWorkspacesContext } from "@/context/WorkspacesContext";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    const { workspaces, setWorkspaces, refetch } = useWorkspacesContext();

    React.useEffect(() => {
        refetch();
    }, [])
    return <>{children}</>
  }