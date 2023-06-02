import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUserBookmarks } from "../bookmark";

import YoutubeVideoCard from "../components/YoutubeVideoCard";
import Footer from "~/components/Footer";

import Header from "~/components/Header";
import { FaArrowUp } from "react-icons/fa";
import { ImHome } from "react-icons/im";

import BlogPostCard, { BlogData } from "../components/BlogPostCard";
import MSBlogPostCard, { MSBlogPostData } from "~/components/MSBlogPostCard";
import IntuneMSBlogPostCard, {
  IntuneMSBlogPostData,
} from "~/components/IntuneMSBlogPostCard";
import WindowsBlogPostCard, {
  WindowsBlogPostData,
} from "~/components/WindowsBlogPostCard";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { RxOpenInNewWindow } from "react-icons/rx";

import BookmarkButton from "../components/BookmarkButton";

interface BookmarkData {
  blogBookmarks: any[];
  videoBookmarks: any[];
}

const Bookmark = () => {
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

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!isScrolling && window.pageYOffset > 400) {
        setIsScrolling(true);
      } else if (isScrolling && window.pageYOffset <= 400) {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [isScrolling]);

  const exportBookmarks = () => {
    const { blogBookmarks } = bookmarks;

    let csvContent = "Author,Title,URL\n";
    blogBookmarks.forEach((bookmark: any) => {
      if (bookmark.BlogPost) {
        const { author, title, url } = bookmark.BlogPost;
        csvContent += `${author || ""},${title || ""},${url || ""}\n`;
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bookmarks.csv";

    link.click();

    URL.revokeObjectURL(link.href);
  };

  const exportButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Header title="My Bookmarks" />
      </div>

      <div className="ml-2 mr-2 pb-20">
        <div className="mb-4 flex items-center">
          <button
            ref={exportButtonRef}
            onClick={exportBookmarks}
            disabled={bookmarks.blogBookmarks.length === 0}
            className={`flex items-center rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700 
              ${
                bookmarks.blogBookmarks.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
          >
            <AiOutlineCloudDownload className="text-2xl" />
            <span className="ml-2">Export Bookmarks (CSV)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  {/*                   <p className="mb-2 text-gray-600">
                    Summary: {bookmark.BlogPost.summary}
                  </p> */}
                  <BookmarkButton
                    blogId={bookmark.blogId}
                    userId={user?.id || null}
                    userBookmarks={bookmarks.blogBookmarks.reduce(
                      (acc: Record<number, boolean>, curr: any) => {
                        acc[curr.blogId] = true;
                        return acc;
                      },
                      {}
                    )}
                    windowsBlogId={0}
                    intunemsBlogId={0}
                    msBlogId={0}
                  />
                  <a
                    href={bookmark.BlogPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="mb-2 mr-2 rounded border border-gray-300 bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700 md:mb-0"
                      title="Open blog post in a new tab"
                    >
                      <RxOpenInNewWindow />
                    </button>
                  </a>
                </>
              )}
              {bookmark.WindowsBlogPost && (
                <>
                  <h2 className="mb-2 text-xl font-bold">
                    {bookmark.WindowsBlogPost.title}
                  </h2>
                  <p className="mb-2 text-gray-600">
                    {bookmark.WindowsBlogPost.author} -{" "}
                    {new Date(
                      bookmark.WindowsBlogPost.createdAt
                    ).toLocaleDateString()}
                  </p>
                </>
              )}
              {bookmark.IntuneMSBlogPost && (
                <>
                  <h2 className="mb-2 text-xl font-bold">
                    {bookmark.IntuneMSBlogPost.title}
                  </h2>
                  <p className="mb-2 text-gray-600">
                    {bookmark.IntuneMSBlogPost.author} -{" "}
                    {new Date(
                      bookmark.IntuneMSBlogPost.createdAt
                    ).toLocaleDateString()}
                  </p>
                </>
              )}
              {bookmark.MSBlogPost && (
                <>
                  <h2 className="mb-2 text-xl font-bold">
                    {bookmark.MSBlogPost.title}
                  </h2>
                  <p className="mb-2 text-gray-600">
                    {bookmark.MSBlogPost.author} -{" "}
                    {new Date(
                      bookmark.MSBlogPost.createdAt
                    ).toLocaleDateString()}
                  </p>{" "}
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

      {isScrolling && (
        <div
          className="fixed bottom-10 right-0 z-50 mb-4 mr-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaArrowUp />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Bookmark;
