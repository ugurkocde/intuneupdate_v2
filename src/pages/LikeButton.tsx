import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

interface LikeButtonProps {
  blogId?: number;
  intunemsBlogId?: number;
  msBlogId?: number;
  windowsBlogId?: number;
  userId: string | null;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  blogId,
  userId,
  intunemsBlogId,
  msBlogId,
  windowsBlogId,
}) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchLikes = async () => {
    const id = blogId || intunemsBlogId || msBlogId || windowsBlogId;
    const type = blogId
      ? "blogId"
      : intunemsBlogId
      ? "intunemsBlogId"
      : msBlogId
      ? "msBlogId"
      : "windowsBlogId";

    try {
      const response = await fetch(`/api/likes/getLikes?${type}=${id}`);

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
  }, [blogId, intunemsBlogId, msBlogId, windowsBlogId]);

  const handleLike = async () => {
    const id = blogId || intunemsBlogId || msBlogId || windowsBlogId;
    const type = blogId
      ? "blogId"
      : intunemsBlogId
      ? "intunemsBlogId"
      : msBlogId
      ? "msBlogId"
      : "windowsBlogId";

    if (!userId) {
      toast.error("Please sign in to like this blog post.");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [type]: id, userId }),
    };

    const url = liked ? "/api/likes/removeLike" : "/api/likes/addLike";
    const changeLikesBy = liked ? -1 : 1;

    try {
      const response = await fetch(url, requestOptions);

      if (response.ok) {
        setLiked(!liked);
        setLikes((likes) => likes + changeLikesBy);
      } else {
        console.error(`Failed to ${liked ? "remove" : "add"} like`);
      }
    } catch (error) {
      console.error(
        `Error while ${liked ? "unliking" : "liking"} the post:`,
        error
      );
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleLike();
        }}
        aria-label="Like the post"
      >
        {" "}
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
