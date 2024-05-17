"use client";
import React from "react";
import ChatComponent from "./ChatComponent";
import { messages as _messages } from "@/lib/db/schema";
import Cmkd from "./Cmdk/Cmkd";
import HeaderArea from "./HeaderArea";
import { v4 } from "uuid";


const ChatePageComponent = ({chatId}: {chatId: string}) => {
  return (
    <>
      <HeaderArea />
      <>
        <Cmkd chatId={chatId} />
        <div className="flex w-full max-h-screen overflow-hidden border-x-[15px] border-x-transparent">
          <div className="w-full flex flex-col relative h-[100dvh] overflow-y-scroll pt-[65px] no-scrollbar">
            <ChatComponent chatId={chatId} />
          </div>
        </div>
      </>
    </>
  );
};

export default ChatePageComponent;
