// YoutubeVideoCard.tsx
import React, { useState, useEffect } from "react";
import VideoLikeButton from "../pages/VideoLikeButton";
import VideoBookmarkButton from "../components/VideoBookmarkButton";
import { ImYoutube } from "react-icons/im";
import { getUserVideoBookmarks } from "../videoBookmarks"; // Import getUserVideoBookmarks

interface YoutubeVideoCardProps {
  id: number;
  title: string;
  url: string;
  author: string;
  createdAt: string;
  userId: string | null;
}

const YoutubeVideoCard: React.FC<YoutubeVideoCardProps> = ({
  id,
  title,
  url,
  author,
  createdAt,
  userId,
}) => {
  const videoId = url.split("watch?v=")[1];
  const [userVideoBookmarks, setUserVideoBookmarks] = useState({});

  useEffect(() => {
    const fetchVideoBookmarks = async () => {
      if (userId) {
        const data = await getUserVideoBookmarks(userId);
        setUserVideoBookmarks(data);
      }
    };
    fetchVideoBookmarks();
  }, [userId]);

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-700">
          {author} <span className="mx-1">-</span>{" "}
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <ImYoutube className="text-4xl text-red-500" />
      </a>
      <VideoLikeButton videoId={id} userId={userId} />
      <VideoBookmarkButton
        videoId={id}
        userId={userId}
        userBookmarks={userVideoBookmarks}
      />
    </div>
  );
};

export default YoutubeVideoCard;
