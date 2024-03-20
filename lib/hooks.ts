import axios from "axios";

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