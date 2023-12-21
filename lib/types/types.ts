import { DrizzleWorkspace } from "../db/schema";

export type Metadata = {
    text: string;
    pageNumber?: number;
    chatId?: string;
    fileId?: number;
  };

export type RelatedData = {
  relatedChatIds: string[];
  pageNumbers: PageNumberObject[];
  fileIds: number[];
  context: string;
};

export type PageNumberObject = Record<number, number[]>;

export type RelatedFile = {
  url: string;
  fileName: string;
  pageNumbers: number[];
}

export type WorkspaceWithRole = DrizzleWorkspace & {
  role: string;
}