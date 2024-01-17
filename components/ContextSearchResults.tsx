import React from "react";
import { Metadata } from "@/lib/types/types";
import { CrossIcon, XIcon } from "lucide-react";
import Link from "next/link";

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
    <div className="absolute mx-auto max-w-4xl w-full -translate-x-1/2 left-1/2 bg-slate-300 dark:bg-slate-800 p-3 rounded-md">
      <XIcon
        className="w-5 h-5 absolute right-3 top-3 cursor-pointer"
        onClick={closeSearchResults}
      />
      {isSearching && <p className="mb-3">Searching...</p>}
      {searchResults.length > 0 && (
        <h3 className="text-xl mb-2">Top context results</h3>
      )}
      {searchResults.map((result, index) => (
        <div key={index} className="flex gap-3 justify-between">
          <p
            className="text-ellipsis overflow-hidden whitespace-nowrap [&:not(:last-child)]:mb-2 hover:underline"
          >
            {/* if result object has chatId key */}
            {result.chatId && (
              <Link href={`/chats/${result.chatId}`}>{result.text}</Link>
            )}
            {result.fileKey && (
              <a
                href={`https://chatpdf-ultra.s3.eu-central-1.amazonaws.com/${result.fileKey}#page=${result.pageNumber}`}
                target="_blank"
              >
                {result.text}
              </a>
            )}
          </p>
          {result.score && <p className="text-gray-500 dark:text-gray-400">
             {result.score.toFixed(2)}
          </p>}
        </div>
      ))}
    </div>
  );
};

export default ContextSearchResults;
