// LikeButton.tsx
import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

interface LikeButtonProps {
  blogId: number;
  userId: string | null;
}

const LikeButton: React.FC<LikeButtonProps> = ({ blogId, userId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchLikes = async () => {
    try {
      const response = await fetch(`/api/likes/getLikes?blogId=${blogId}`);

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
      console.error("Error fetching likes:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  const handleLike = async () => {
    if (!userId) {
      toast.error("Please sign in to like this blog post.");
      return;
    }
    if (!liked) {
      try {
        const response = await fetch("/api/likes/addLike", {
          // <-- Updated URL here
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId, userId }),
        });

        if (response.ok) {
          setLiked(true);
          setLikes(likes + 1);
        } else {
          console.error("Failed to like the post");
        }
      } catch (error) {
        console.error("Error while liking the post:", error);
      }
    } else {
      try {
        const response = await fetch("/api/likes/removeLike", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId, userId }),
        });

        if (response.ok) {
          setLiked(false);
          setLikes(likes - 1);
        } else {
          console.error("Failed to remove like");
        }
      } catch (error) {
        console.error("Error while unliking the post:", error);
      }
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={handleLike} aria-label="Like the post">
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

export default LikeButton;
