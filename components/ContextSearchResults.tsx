import React from "react";
import { Metadata } from "@/lib/types/types";

type Props = {
  isSearching: boolean;
  searchResults: Metadata[];
};

const ContextSearchResults = ({ isSearching, searchResults }: Props) => {
  console.log("isSearching", isSearching);
  console.log("searchResults", searchResults);
  return (
    <div className="absolute">
      da
      {isSearching && <p>Searching...</p>}
      {searchResults.length > 0 && <p>Search results:</p>}
      {searchResults.map((result) => (
        <p key={result.chatId}>{result.text.substring(0, 30)}</p>
      ))}
    </div>
  );
};

export default ContextSearchResults;
