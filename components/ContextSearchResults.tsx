import React from "react";
import { Metadata } from "@/lib/types/types";
import { CrossIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  isSearching: boolean;
  searchResults: Metadata[];
  setSearchResults: React.Dispatch<React.SetStateAction<Metadata[]>>;
};

const ContextSearchResults = ({
  isSearching,
  searchResults,
  setSearchResults,
}: Props) => {
  const closeSearchResults = () => {
    setSearchResults([]);
  };

  return (
    <div className="fixed mx-auto max-w-4xl w-full -translate-x-1/2 left-1/2 bg-yellow-100 dark:text-black  p-3 rounded-br-md rounded-bl-md shadow-2xl">
      <XIcon
        className="w-5 h-5 absolute right-3 top-3 cursor-pointer"
        onClick={closeSearchResults}
      />
      {isSearching && <p className="mb-3">Searching...</p>}
      {searchResults.length > 0 && (
        <h3 className="text-xl mb-2">Top context results</h3>
      )}
      {searchResults.map((result, index) => (
        <div
          key={index}
          className={cn(
            "flex gap-3 justify-between bg-yellow-200 my-2 rounded-md py-1 px-2 hover:bg-yellow-300 transition-colors",
            {
              "bg-green-300 hover:bg-green-500":
                result.score && result.score >= 0.8,
            }
          )}
        >
          <p className="text-ellipsis overflow-hidden whitespace-nowrap w-full">
            {result.chatId && (
              <Link
                className="block"
                href={`/chats/${result.chatId}`}
                title={result.text}
              >
                {result.text}
              </Link>
            )}
            {result.fileKey && (
              <a
                className="block"
                title={result.text}
                href={`https://chatpdf-ultra.s3.eu-central-1.amazonaws.com/${result.fileKey}#page=${result.pageNumber}`}
                target="_blank"
              >
                {result.text}
              </a>
            )}
          </p>
          {result.score && (
            <p className={cn({ "text-gray-500": result.score < 0.8 })}>
              {result.score.toFixed(2)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContextSearchResults;
