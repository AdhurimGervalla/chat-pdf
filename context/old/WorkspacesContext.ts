import { DrizzleWorkspace } from "@/lib/db/schema";
import { WorkspaceWithRole } from "@/lib/types/types";
import React, { useContext } from "react";

interface WorkspaceContext {
    workspaces: WorkspaceWithRole[];
    setWorkspaces: (workspace: WorkspaceWithRole[]) => void;
    refetch: () => void;
}

export const WorkspacesContext = React.createContext<WorkspaceContext>({
    workspaces: [],
    setWorkspaces: () => {},
    refetch: () => {},
});

export const useWorkspacesContext = () =>  useContext(WorkspacesContext);