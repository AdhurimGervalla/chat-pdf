import React, { useContext } from "react";
import { DrizzleUsers } from "@/lib/db/schema";

interface UserContext {
    user: DrizzleUsers | undefined;
    refetch: (callback?: () => void) => void;
}

export const UserContext = React.createContext<UserContext>({
    user: undefined,
    refetch: () => {},
});

export const useChatsContext = () =>  useContext(UserContext);