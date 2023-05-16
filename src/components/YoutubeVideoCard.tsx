import React, { useState } from "react";
import VideoLikeButton from "../pages/VideoLikeButton";
import VideoBookmarkButton from "../components/VideoBookmarkButton";
import { getUserVideoBookmarks } from "../videoBookmarks";
import { ImYoutube } from "react-icons/im";
import { ImPlay2 } from "react-icons/im";

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
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const [userVideoBookmarks, setUserVideoBookmarks] = useState({});

  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div
      className="mb-6 rounded-lg bg-white p-4 shadow-md"
      style={{ borderLeft: "4px solid red" }}
    >
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-700">
          {author} <span className="mx-1">-</span>{" "}
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
          background: `url(${thumbnailUrl}) no-repeat`,
          backgroundSize: "cover",
          cursor: "pointer",
        }}
        onClick={playVideo}
      >
        {!isPlaying && (
          <ImPlay2
            className="absolute text-5xl text-white"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
        {isPlaying && (
          <iframe
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            src={`${embedUrl}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
      <VideoLikeButton videoId={id} userId={userId} />
      <VideoBookmarkButton
        videoId={id}
        userId={userId}
        userBookmarks={userVideoBookmarks}
      />
      <div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ImYoutube className="text-4xl text-red-500" />
        </a>
      </div>
    </div>
  );
};

export default YoutubeVideoCard;
