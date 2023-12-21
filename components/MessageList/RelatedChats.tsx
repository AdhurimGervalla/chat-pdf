import { DrizzleChat } from "@/lib/db/schema";
import React from "react";
import { Info, Link as LinkIcon, Loader2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { LinkItem } from "./RelatedContext";
type Props = {
  relatedChatIds: string[];
  allChats: DrizzleChat[];
};

const RelatedChats = ({ relatedChatIds, allChats }: Props) => {
  return (
    <p className="flex gap-2">
      <span className="font-bold">Related Chats:</span>{" "}
      <span className="flex flex-wrap">
        {relatedChatIds.map((id, index) => {
          if (id) {
            let chatTitle = "Chat " + (index + 1);
            let fullChatTitle = chatTitle;
            if (allChats) {
              const chat = allChats.find((c) => c.id === id);
              if (chat && chat.title) {
                fullChatTitle = chat.title;
                if (chat.title.length > 20) {
                  chatTitle = chat.title.substring(0, 20) + "...";
                } else {
                  chatTitle = chat.title;
                }
              }
            }
            return (
              <LinkItem title={fullChatTitle} key={id} url={`/chat/${id}`}>
                {chatTitle}
              </LinkItem>
            );
          }
        })}
        {relatedChatIds.length === 0 && <span>No related chats</span>}
      </span>
    </p>
  );
};

export default RelatedChats;
