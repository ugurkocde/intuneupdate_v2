import React, { useRef, useState, useEffect } from "react";
import { FiShare2, FiCopy } from "react-icons/fi";
import {
  BsTwitter,
  BsLinkedin,
  BsBookmarkPlusFill,
  BsBookmarkDashFill,
} from "react-icons/bs";
import { RxOpenInNewWindow } from "react-icons/rx";
import { toast } from "react-toastify";
import LikeButton from "../pages/LikeButton";
import { useUser } from "@clerk/clerk-react";
import BookmarkButton from "./BookmarkButton";
import SummaryModal from "./Summary_Modal";

export interface BlogData {
  id: number;
  title: string;
  author: string;
  content?: string;
  createdAt: string;
  summary?: string;
  date: Date;
  url: string;
  releaseDate?: Date;
}

interface BlogPostCardProps {
  blog: BlogData;
  userBookmarks: Record<number, boolean>;
  handleBookmark: (blogId: number) => void;
  handleRemoveBookmark: (blogId: number) => void;
  id: number;
  title: string;
  url: string;
  author: string;
  createdAt: string;
  userId: string | null;
}

const BlogPostCard = React.forwardRef<HTMLDivElement, BlogPostCardProps>(
  (
    { blog, userBookmarks, handleBookmark, handleRemoveBookmark, userId },
    ref
  ) => {
    const shareButtonContainerRef = useRef<HTMLDivElement>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [openSummary, setOpenSummary] = useState<number | null>(null);
    const { user } = useUser();

    const toggleDropdown = (id: number) => {
      setOpenDropdownId((prevState) => (prevState === id ? null : id));
    };

    const shareOnTwitter = (title: string, url: string) => {
      const tweetText = encodeURIComponent(`${title} ${url}`);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
      window.open(twitterUrl, "_blank");
    };

    const shareOnLinkedIn = (url: string) => {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`;
      window.open(linkedInUrl, "_blank");
    };

    const copyURL = (url: string) => {
      navigator.clipboard.writeText(url).then(() => {
        toast.success("URL copied to clipboard!");
      });
    };

    const toggleSummary = (index: number) => {
      if (openSummary === index) {
        setOpenSummary(null);
      } else {
        setOpenSummary(index);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          shareButtonContainerRef.current &&
          !shareButtonContainerRef.current.contains(event.target as Node) &&
          (!dropdownRef.current ||
            !dropdownRef.current.contains(event.target as Node))
        ) {
          event.preventDefault();
          setOpenDropdownId(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const [summaryModalOpen, setSummaryModalOpen] = useState(false);

    return (
      <div
        key={blog.id}
        className="h-full rounded-lg bg-white p-4 shadow transition-shadow duration-300 hover:shadow-lg"
        style={{
          borderLeft: "4px solid green",
          cursor: "pointer",
          position: "relative",
          paddingBottom: "50px", // Set this as per the height of LikeButton
        }}
        ref={ref}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            window.open(blog.url, "_blank");
          }
        }}
        title={blog.title}
      >
        <div className="text-gray-700">
          <div onClick={() => window.open(blog.url, "_blank")}>
            <h2 className="mb-2 text-xl font-bold sm:text-lg">{blog.title}</h2>
            <div className="text-gray-700">
              <p className="mb-2 text-sm font-semibold">
                {blog.author}
                <span className="mx-1">-</span>
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mb-2 flex flex-col">
            <div className="mb-2 flex flex-wrap items-center">
              <div onClick={(e) => e.stopPropagation()}>
                <BookmarkButton
                  blogId={blog.id}
                  userId={user?.id || null}
                  userBookmarks={userBookmarks}
                  windowsBlogId={0}
                  intunemsBlogId={0}
                  msBlogId={0}
                />
              </div>
              <a
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="mb-2 mr-2 rounded border border-gray-300 bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700 md:mb-0"
                  title="Open blog post in a new tab"
                >
                  <RxOpenInNewWindow />
                </button>
              </a>

              <div
                className="relative inline-block"
                ref={shareButtonContainerRef}
              >
                <button
                  className="mb-2 mr-2 rounded border border-gray-300 px-4 py-2 font-bold hover:border-gray-400 md:mb-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(blog.id);
                  }}
                  title="Share"
                >
                  <FiShare2 />
                </button>
                {openDropdownId === blog.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(blog.id);
                      }}
                    >
                      <button
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareOnTwitter(blog.title, blog.url);
                          toggleDropdown(blog.id);
                        }}
                      >
                        <BsTwitter className="mr-2" />
                        <span>Share on Twitter</span>
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareOnLinkedIn(blog.url);
                          toggleDropdown(blog.id);
                        }}
                      >
                        <BsLinkedin className="mr-2" />
                        <span>Share on LinkedIn</span>
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyURL(blog.url);
                          toggleDropdown(blog.id);
                        }}
                      >
                        <FiCopy className="mr-2" />
                        <span>Copy URL</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <SummaryModal
              isOpen={summaryModalOpen}
              closeModal={() => setSummaryModalOpen(false)}
              summary={blog.summary}
              title={blog.title}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSummaryModalOpen(true);
              }}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Show Summary
            </button>

            <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
              <LikeButton blogId={blog.id} userId={user?.id || null} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default BlogPostCard;
