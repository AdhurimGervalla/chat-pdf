import { WorkspaceWithRole } from "@/lib/types/types";
import React from "react";
import Workspaces from "./Workspaces";
import { getAllWorkspaces } from "@/lib/hooks";
import { useParams } from "next/navigation";
import LoaderSpinner from "./LoaderSpinner";

const FavoriteWorkspacesList = () => {
  const { chatId } = useParams();
  const [workspaces, setWorkspaces] = React.useState<WorkspaceWithRole[]>([]);
  React.useEffect(() => {
    (async () => {
      const {workspaces} = await getAllWorkspaces(chatId);
      setWorkspaces(workspaces);
    })();
  }, []);

  return workspaces.length === 0 ? (
    <LoaderSpinner />
  ) : (
    <Workspaces workspaces={workspaces} />
  );
};

export default FavoriteWorkspacesList;
