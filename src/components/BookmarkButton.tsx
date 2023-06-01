import React, { useState, useEffect } from "react";
import { addBookmark, removeBookmark, getUserBookmarks } from "../bookmark";
import { BsBookmarkPlusFill, BsBookmarkDashFill } from "react-icons/bs";
import { toast } from "react-toastify";

interface BookmarkButtonProps {
  blogId: number;
  windowsBlogId: number;
  intunemsBlogId: number;
  msBlogId: number;
  userId: string | null;
  userBookmarks: { [key: number]: any };
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  blogId,
  userId,
  userBookmarks,
  windowsBlogId,
  intunemsBlogId,
  msBlogId,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (userId) {
        const fetchedBookmarks = await getUserBookmarks(userId);
        if (fetchedBookmarks) {
          const isCurrentPostBookmarked = fetchedBookmarks.blogBookmarks.find(
            (bookmark) =>
              bookmark.blogId === blogId ||
              bookmark.windowsBlogId === windowsBlogId ||
              bookmark.intunemsBlogId === intunemsBlogId ||
              bookmark.msBlogId === msBlogId
          );
          setIsBookmarked(!!isCurrentPostBookmarked);
        }
      }
    };
    fetchBookmarks();
  }, [userId, blogId, windowsBlogId, intunemsBlogId, msBlogId]);

  useEffect(() => {
    setIsBookmarked(
      !!userBookmarks[blogId] ||
        !!userBookmarks[windowsBlogId] ||
        !!userBookmarks[intunemsBlogId] ||
        !!userBookmarks[msBlogId]
    );
  }, [userBookmarks, blogId, windowsBlogId, intunemsBlogId, msBlogId]);

  const handleBookmark = async () => {
    if (!userId) {
      toast.error("You must be logged in to bookmark a blog post.");
      return;
    }

    if (isBookmarked) {
      await removeBookmark(
        userId,
        blogId,
        windowsBlogId,
        intunemsBlogId,
        msBlogId
      );
      setIsBookmarked(false);
    } else {
      await addBookmark(
        userId,
        blogId,
        windowsBlogId,
        intunemsBlogId,
        msBlogId
      );
      setIsBookmarked(true);
    }
  };

  return (
    <>
      {!isBookmarked && (
        <button
          className="mb-2 mr-2 rounded border border-gray-300 bg-green-500 p-4 px-4 py-2 font-bold text-white hover:bg-green-700 md:mb-0"
          onClick={handleBookmark}
          title="Add Bookmark"
        >
          <BsBookmarkPlusFill />
        </button>
      )}
      {isBookmarked && (
        <button
          className="mb-2 mr-2 rounded border border-gray-300 bg-red-500 p-4 px-4 py-2 font-bold text-white hover:bg-red-700 md:mb-0"
          onClick={handleBookmark}
          title="Remove bookmark"
        >
          <BsBookmarkDashFill />
        </button>
      )}
    </>
  );
};

export default BookmarkButton;
