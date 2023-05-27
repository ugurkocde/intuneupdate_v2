import React, { useState, useEffect } from "react";
import { addBookmark, removeBookmark, getUserBookmarks } from "../bookmark";
import { BsBookmarkPlusFill, BsBookmarkDashFill } from "react-icons/bs";

interface BookmarkButtonProps {
  blogId: number;
  windowsBlogId: number;
  userId: string | null;
  userBookmarks: { [key: number]: any };
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  blogId,
  userId,
  userBookmarks,
  windowsBlogId,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (userId) {
        const fetchedBookmarks = await getUserBookmarks(userId);
        if (fetchedBookmarks) {
          userBookmarks = { ...fetchedBookmarks.blogBookmarks };
          setIsBookmarked(
            !!userBookmarks[blogId] || !!userBookmarks[windowsBlogId]
          );
        }
      }
    };
    fetchBookmarks();
  }, [userId, blogId, windowsBlogId]);

  useEffect(() => {
    setIsBookmarked(!!userBookmarks[blogId] || !!userBookmarks[windowsBlogId]);
  }, [userBookmarks, blogId, windowsBlogId]);

  const handleBookmark = async () => {
    if (!userId) {
      alert("You must be logged in to bookmark a blog post.");
      return;
    }

    if (isBookmarked) {
      await removeBookmark(userId, blogId, windowsBlogId);
      setIsBookmarked(false);
    } else {
      await addBookmark(userId, blogId, windowsBlogId);
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
