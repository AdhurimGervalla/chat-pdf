'use client'
import React from 'react'
import axios from 'axios'
import { DrizzleUsers } from "@/lib/db/schema";
import { UserContext } from './UserContext';

type Props = {
    children: React.ReactNode
}

function UserContextProvider({children}: Props) {
  const [user, setUser] = React.useState<DrizzleUsers>();

  const refetch = async (callback?: () => void) => {
    const res = await axios.post("/api/get-my-user");
    setUser(res.data);
    if (callback) {
      callback();
    }
  };

  React.useEffect(() => {
    refetch();
  }, []);

  return <UserContext.Provider value={{user, refetch}}>{children}</UserContext.Provider>
}

export default UserContextProvider;