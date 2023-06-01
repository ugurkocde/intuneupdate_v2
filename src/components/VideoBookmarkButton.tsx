import React, { useState, useEffect } from "react";
import { addVideoBookmark, removeVideoBookmark } from "../videoBookmarks";
import { BsBookmarkPlusFill, BsBookmarkDashFill } from "react-icons/bs";
import { toast } from "react-toastify";

interface VideoBookmarkButtonProps {
  videoId: number;
  userId: string | null;
  userBookmarks: { [key: number]: any };
}

const VideoBookmarkButton: React.FC<VideoBookmarkButtonProps> = ({
  videoId,
  userId,
  userBookmarks,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(!!userBookmarks[videoId]);
  }, [userBookmarks, videoId]);

  const handleBookmark = async () => {
    if (!userId) {
      toast.error("You must be logged in to bookmark a video.");
      return;
    }

    if (isBookmarked) {
      await removeVideoBookmark(userId, videoId);
      setIsBookmarked(false);
    } else {
      await addVideoBookmark(userId, videoId);
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

export default VideoBookmarkButton;
