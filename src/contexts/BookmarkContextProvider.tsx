import { useState, createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useJobItems from "../hooks/useJobItems";
import { JobItemExpanded } from "../types";

type BookmarkContextProp = {
  handleToggleBookmark: (id: number) => void;
  bookmarkIds: number[];
  isLoading: boolean;
  bookmarkedJobItems: JobItemExpanded[]
};
const BookmarkContext = createContext<BookmarkContextProp | null>(null);

export default function BookmarkContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookmarkIds, setBookmarkIds] = useLocalStorage<number[]>(
    "bookmarks",
    []
  ); 

  const { isLoading, jobItems: fetchedJobItems} =  useJobItems(bookmarkIds);

  const handleToggleBookmark = (id: number) => {
    if (bookmarkIds.includes(id)) {
      setBookmarkIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkIds((prev) => [...prev, id]);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkIds,
        handleToggleBookmark, 
        isLoading,
        bookmarkedJobItems:fetchedJobItems
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarkIdsContext = () => {
  const ctx = useContext(BookmarkContext);

  if (!ctx) {
    throw new Error("Bookmark Context is missing");
  }


 
  const { handleToggleBookmark, bookmarkIds, isLoading, bookmarkedJobItems } = ctx;
  return { handleToggleBookmark, bookmarkIds,  isLoading, bookmarkedJobItems };
};
