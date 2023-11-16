import { DrizzleWorkspace } from "@/lib/db/schema";
import React, { useContext } from "react";

interface WorkspaceContext {
    workspace: DrizzleWorkspace | null;
    setWorkspace: (workspace: DrizzleWorkspace | null) => void;
}

export const WorkspaceContext = React.createContext<WorkspaceContext>({
    workspace: null,
    setWorkspace: () => {},
});

export const useWorkspaceContext = () =>  useContext(WorkspaceContext);