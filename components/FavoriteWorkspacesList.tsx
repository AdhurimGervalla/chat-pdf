import React from "react";
import Workspaces from "./Workspaces";
import { RootState } from "@/context/state/store";
import {useAppSelector} from "@/lib/hooks";
import {fetchAllWorkspaces} from "@/context/state/workspace/workspaceSlice";

const FavoriteWorkspacesList = () => {
  const workspaces = useAppSelector((state: RootState) => state.workspaces.value);
  fetchAllWorkspaces();
  return <Workspaces workspaces={workspaces} />
};

export default FavoriteWorkspacesList;
