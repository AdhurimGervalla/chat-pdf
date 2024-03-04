import axios from "axios";
import { WorkspaceWithRole } from "./types/types";

/**
 * 
 * @param chatId string | string[]
 * @returns Promise<{workspaces: WorkspaceWithRole[]}>
 */
export const getAllWorkspaces = async (chatId: string | string[]): Promise<{workspaces: WorkspaceWithRole[]}> => {
    let data: WorkspaceWithRole[] = [];
    const res = await axios.get("/api/get-workspaces");
    if (res.data.workspaces) {
      data = res.data.workspaces;
    }
    return {workspaces: data};
}

/**
 * 
 * @param chatId string
 * @returns 
 */
export const useGetChats = async (chatId: string): Promise<[]> => {
    let data = [];
    const res = await axios.post("/api/get-messages", { chatId });
    data = res.data;
    return data;
}