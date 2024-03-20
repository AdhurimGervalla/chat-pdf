import { WorkspaceWithRole } from "@/lib/types/types";
import React from "react";
import Workspaces from "./Workspaces";
import { useParams } from "next/navigation";
import LoaderSpinner from "./LoaderSpinner";
import { useWorkspacesContext } from "@/context/WorkspacesContext";

const FavoriteWorkspacesList = () => {
  const { chatId } = useParams();
  const { workspaces, setWorkspaces } = useWorkspacesContext();

  return <Workspaces workspaces={workspaces} />
};

export default FavoriteWorkspacesList;
