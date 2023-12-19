import React, { useContext } from "react";

interface CmdkOpenStateContext {
    open: boolean;
    setOpen: any;
}

export const CmdkOpenStateContext = React.createContext<CmdkOpenStateContext>({
    open: false,
    setOpen: () => {},
});

export const useCmdkOpenStateContext = () =>  useContext(CmdkOpenStateContext);