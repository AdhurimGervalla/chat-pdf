import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { workspaceRole } from "./db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertStringToASCII(str: string) {
  // remove all non-ascii characters
  const asciiString = str.replace(/[^\x00-\x7F]/g, "");
  return asciiString;
}

export const languages: readonly string[] = ["de", "en"];

export function getNamespaceForWorkspace(workspaceId: string, userId: string) {
  return workspaceId + "-" + userId;
}

export function setNameSpaceForWorkspace(workspaceId: string, userId: string) {
  return workspaceId + "-" + userId;
}

/**
 * Resets the backspace key
 * @param e the event
 */
export function resetBackspace (e: React.KeyboardEvent) {
  if (e.key === 'Backspace') {
    e.stopPropagation();
  }
}

/**
 * Checks if the chat is the current chat
 * @param id the id of the chat
 * @param currentChatId the id of the current chat
 */
export function isCurrentChat (id: string, currentChatId: string) {
  return id === currentChatId;
}

/**
 * Trims the chat title to a certain length
 * @param title the title to trim
 * @param length the length to trim to
 */
export function trimChatTitle(title: string, length: number = 50) {
  if (title.length > length) {
      return title.slice(0, length) + '...';
  }
  return title;
}

/**
 * Gets the role name
 * @param role the role
 */
export function getRoleName(role: string) {
  switch (role) {
      case workspaceRole.MEMBER:
          return 'Member';
      case workspaceRole.OWNER:
          return 'Owner';
      case workspaceRole.ADMIN:
          return 'Admin';
      default:
          return '';
  }
}