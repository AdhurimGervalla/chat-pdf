import { DrizzleWorkspace } from "../db/schema";

export type Metadata = {
    text: string;
    pageNumber?: number;
    chatId?: string;
    fileId?: number;
  };

export type RelatedData = {
  relatedChatIds: string[];
  pageNumbers: number[];
  fileIds: number[];
  context: string;
};

export type RelatedFile = {
  url: string;
  pageNumbers: number[];
}

export type WorkspaceWithRole = DrizzleWorkspace & {
  role: string;
}