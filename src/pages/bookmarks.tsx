import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUserBookmarks } from "../bookmark";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import YoutubeVideoCard from "../components/YoutubeVideoCard";

interface BookmarkData {
  blogBookmarks: any[];
  videoBookmarks: any[];
}

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkData>({
    blogBookmarks: [],
    videoBookmarks: [],
  });
  const { user } = useUser();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        const data = await getUserBookmarks(user.id);
        if (data) {
          setBookmarks(data);
        }
      }
    };
    fetchBookmarks();
  }, [user]);

  useEffect(() => {
    document.title = "Intune Update - Bookmark";
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-4xl font-bold">Bookmarks</h1>
        <ul className="flex items-center">
          <li className="mr-4">
            <Link href="/">
              <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Homepage
              </button>
            </Link>
          </li>
          <li>
            <UserButton />
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {bookmarks.blogBookmarks.map((bookmark: any) => (
          <div key={bookmark.blogId} className="rounded bg-white p-4 shadow">
            {bookmark.BlogPost && (
              <>
                <h2 className="mb-2 text-xl font-bold">
                  {bookmark.BlogPost.title}
                </h2>
                <p className="mb-2 text-gray-600">
                  {bookmark.BlogPost.author} -{" "}
                  {new Date(bookmark.BlogPost.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-2 text-gray-600">
                  Summary: {bookmark.BlogPost.summary}
                </p>
              </>
            )}
          </div>
        ))}
        {bookmarks.videoBookmarks.map((videoBookmark: any) => (
          <div
            key={videoBookmark.videoId}
            className="rounded bg-white p-4 shadow"
          >
            {videoBookmark.YoutubeVideos && (
              <YoutubeVideoCard
                id={videoBookmark.YoutubeVideos.id}
                url={videoBookmark.YoutubeVideos.url}
                title={videoBookmark.YoutubeVideos.title}
                author={videoBookmark.YoutubeVideos.author}
                createdAt={videoBookmark.YoutubeVideos.createdAt}
                userId={null}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
