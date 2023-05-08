// VideoLikeButton.tsx
import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

interface VideoLikeButtonProps {
  videoId: number;
  userId: string | null;
}

const VideoLikeButton: React.FC<VideoLikeButtonProps> = ({
  videoId,
  userId,
}) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchLikes = async () => {
    try {
      const response = await fetch(
        `/api/videoLikes/getVideoLikes?videoId=${videoId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setLikes(data.data.length);
      const isLiked = data.data.some(
        (like: { userId: string }) => like.userId === userId
      );

      setLiked(isLiked);
    } catch (error) {
      console.error("Error fetching video likes:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  const handleLike = async () => {
    if (!userId) {
      toast.error("Please sign in to like this video.");
      return;
    }
    if (!liked) {
      try {
        const response = await fetch("/api/videoLikes/addVideoLike", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId, userId }),
        });

        if (response.ok) {
          setLiked(true);
          setLikes(likes + 1);
        } else {
          console.error("Failed to like the video");
        }
      } catch (error) {
        console.error("Error while liking the video:", error);
      }
    } else {
      try {
        const response = await fetch("/api/videoLikes/removeVideoLike", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId, userId }),
        });

        if (response.ok) {
          setLiked(false);
          setLikes(likes - 1);
        } else {
          console.error("Failed to remove video like");
        }
      } catch (error) {
        console.error("Error while unliking the video:", error);
      }
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={handleLike} aria-label="Like the video">
        {liked ? (
          <AiFillHeart className="text-red-500" />
        ) : (
          <AiOutlineHeart className="text-gray-500" />
        )}
      </button>
      <span className="ml-2">{likes}</span>
    </div>
  );
};

export default VideoLikeButton;
