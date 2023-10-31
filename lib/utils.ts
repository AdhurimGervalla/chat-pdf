import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertStringToASCII(str: string) {
  // remove all non-ascii characters
  const asciiString = str.replace(/[^\x00-\x7F]/g, "");
  return asciiString;
}