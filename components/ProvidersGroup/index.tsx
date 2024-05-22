'use client';
import { useUser } from "@clerk/clerk-react";
import React from "react";
import WorkspaceContextProvider from "@/context/WorkspaceContextProvider";
import CmdkOpenStateContextProvider from "@/context/CmdKOpenStateContextProvider";
import WorkspacesContextProvider from "@/context/WorkspacesContextProvider";
import ChatsContextProvider from "@/context/ChatsContextProvider";
import UserContextProvider from "@/context/UserContextProvider";

const ProvidersGroup = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  if (!user) return children;

  return (
    <UserContextProvider>
      <ChatsContextProvider>
        <WorkspacesContextProvider>
          <WorkspaceContextProvider>
            <CmdkOpenStateContextProvider>
              {children}
            </CmdkOpenStateContextProvider>
          </WorkspaceContextProvider>
        </WorkspacesContextProvider>
      </ChatsContextProvider>
    </UserContextProvider>
  );
};

export default ProvidersGroup;