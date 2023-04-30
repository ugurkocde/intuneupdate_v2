import React, { useEffect, useState, useMemo, useRef } from "react";
import { FiShare2, FiCopy } from "react-icons/fi";
import {
  BsTwitter,
  BsLinkedin,
  BsBookmarkPlusFill,
  BsBookmarkDashFill,
  BsGithub,
} from "react-icons/bs";
import { MdPrivacyTip } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import { RxOpenInNewWindow } from "react-icons/rx";
import { HiOutlineSelector } from "react-icons/hi";
import type { NextPage } from "next";
import { getBlogs } from "../getBlogs";
import "tailwindcss/tailwind.css";
import { useUser } from "@clerk/clerk-react";
import { getUserBookmarks, addBookmark, removeBookmark } from "../bookmark";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import LikeButton from "./LikeButton";

interface Blog {
  id: number;
  author: string;
  title: string;
  releaseDate: string;
}

const Home: NextPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [bookmarks, setBookmarks] = useState({});
  const { user } = useUser();
  const [openSummary, setOpenSummary] = useState<number | null>(null);
  const [userBookmarks, setUserBookmarks] = useState<Record<number, boolean>>(
    {}
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const router = useRouter();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const shareButtonContainerRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const authorDropdownRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareButtonContainerRef.current &&
        !shareButtonContainerRef.current.contains(event.target as Node) &&
        (!dropdownRef.current ||
          !dropdownRef.current.contains(event.target as Node)) &&
        (!searchInputRef.current ||
          !searchInputRef.current.contains(event.target as Node)) &&
        (!authorDropdownRef.current ||
          !authorDropdownRef.current.contains(event.target as Node))
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

  const uniqueAuthors = useMemo(() => {
    const authorsSet = new Set(blogs.map((blog) => blog.author));
    return Array.from(authorsSet);
  }, [blogs]);

  const filteredBlogs = blogs
    .filter((blog) => {
      const keywords = searchTerm.toLowerCase().split(" ");
      return keywords.every((keyword) =>
        blog.title.toLowerCase().includes(keyword)
      );
    })
    .filter((blog) => selectedAuthor === "" || blog.author === selectedAuthor);

  const toggleSummary = (index: number) => {
    if (openSummary === index) {
      setOpenSummary(null);
    } else {
      setOpenSummary(index);
    }
  };

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (user) {
        const bookmarks = await getUserBookmarks(user.id);
        setUserBookmarks(bookmarks);
      }
    };
    fetchUserBookmarks();
  }, [user]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      setBlogs(data);
    };
    fetchBlogs();

    const savedSearchTerm = localStorage.getItem("searchTerm");
    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
    }

    const savedSelectedAuthor = localStorage.getItem("selectedAuthor");
    if (savedSelectedAuthor) {
      setSelectedAuthor(savedSelectedAuthor);
    }

    const fetchBookmarks = async () => {
      if (user) {
        const data = await getUserBookmarks(user.id);
        setBookmarks(data);
      }
    };
    fetchBookmarks();
  }, [user]);

  const onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    localStorage.setItem("searchTerm", newSearchTerm);
  };

  const onSelectedAuthorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSelectedAuthor = event.target.value;
    setSelectedAuthor(newSelectedAuthor);
    localStorage.setItem("selectedAuthor", newSelectedAuthor);
  };

  const handleBookmark = async (blogId: number) => {
    if (!user) {
      toast.error("Please sign in to bookmark this blog post.");
      return;
    }

    if (userBookmarks[blogId]) {
      return;
    }

    try {
      await addBookmark(user.id, blogId);

      // Update the userBookmarks state
      setUserBookmarks({ ...userBookmarks, [blogId]: true });
    } catch (error) {
      console.error("Error bookmarking blog post:", (error as Error).message);
    }
  };
  const handleRemoveBookmark = async (blogId: number) => {
    if (!user) {
      alert("Please sign in to remove bookmark.");
      return;
    }

    try {
      await removeBookmark(user.id, blogId);

      // Update the userBookmarks state
      const updatedUserBookmarks = { ...userBookmarks };
      delete updatedUserBookmarks[blogId];
      setUserBookmarks(updatedUserBookmarks);
    } catch (error) {
      console.error("Error removing bookmark:", (error as Error).message);
    }
  };

  // Shadow on scroll
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.pageYOffset;
      const hasScrolled = scrollTop > 0;
      setHasShadow(hasScrolled);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      setBlogs(data);
      setIsLoading(false);
    };
    fetchBlogs();
  }, []);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  return (
    <div className="container mx-auto">
      <div
        className={`sticky top-0 z-50 bg-white ${
          hasShadow ? "border-b border-gray-200 shadow shadow-lg " : ""
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="w-1/4"></div>
            <div className="w-1/2 text-center">
              <h1 className="mb-4 mt-2 text-3xl font-bold sm:text-5xl">
                Intune Update
              </h1>
            </div>

            <div className="w-1/4">
              <ul className="flex items-center justify-end">
                <SignedOut>
                  <li>
                    <Link href="/sign-in">
                      <button className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        Sign in
                      </button>
                    </Link>
                  </li>
                </SignedOut>
                <SignedIn>
                  <li className="mr-4">
                    <Link href="/bookmarks">
                      <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        My Bookmarks
                      </button>
                    </Link>
                  </li>
                  <li className="mr-4">
                    <UserButton />
                  </li>
                </SignedIn>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-center">
          <div className="relative ml-4 mr-2 mt-2 w-3/5 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <input
              ref={searchInputRef}
              className="block h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm placeholder-gray-500 hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="text"
              placeholder="Search for blog posts"
              value={searchTerm}
              onChange={onSearchTermChange}
              style={{ textAlign: "center" }}
            />
          </div>

          <div className="relative ml-2 mr-4 mt-2 w-3/5 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <select
              ref={authorDropdownRef}
              className="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={selectedAuthor}
              onChange={onSelectedAuthorChange}
            >
              <option value="">All authors</option>
              {uniqueAuthors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="h-4 w-4 fill-current text-gray-500"
                viewBox="0 0 20 20"
              >
                <HiOutlineSelector></HiOutlineSelector>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog: any) => (
            <div
              key={blog.id}
              className="rounded bg-white p-4 shadow transition-shadow duration-300 hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-bold sm:text-lg">
                {blog.title}
              </h2>

              <div className="text-gray-700">
                <p className="mb-2 text-sm font-semibold">
                  {blog.author}
                  <span className="mx-1">-</span>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div className="mb-2 flex flex-col">
                  <div className="mb-2 flex flex-wrap items-center">
                    {!userBookmarks[blog.id] && (
                      <button
                        className="mb-2 mr-2 rounded border border-gray-300 bg-green-500 p-4 px-4 py-2 font-bold text-white hover:bg-green-700 md:mb-0"
                        onClick={() => handleBookmark(blog.id)}
                        title="Add Bookmark"
                      >
                        <BsBookmarkPlusFill></BsBookmarkPlusFill>
                      </button>
                    )}
                    {userBookmarks[blog.id] && (
                      <>
                        <button
                          className="mb-2 mr-2 rounded border border-gray-300 bg-red-500 p-4 px-4 py-2 font-bold text-white hover:bg-red-700 md:mb-0"
                          onClick={() => handleRemoveBookmark(blog.id)}
                          title="Remove bookmark"
                        >
                          <BsBookmarkDashFill></BsBookmarkDashFill>
                        </button>
                      </>
                    )}
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        className="mb-2 mr-2 rounded border border-gray-300 bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700 md:mb-0"
                        title="Open blog post in a new tab"
                      >
                        <RxOpenInNewWindow></RxOpenInNewWindow>
                      </button>
                    </a>

                    <div
                      className="relative inline-block"
                      ref={shareButtonContainerRef}
                    >
                      <button
                        className="mb-2 mr-2 rounded border border-gray-300 px-4 py-2 font-bold hover:border-gray-400 md:mb-0"
                        onClick={() => toggleDropdown(blog.id)}
                        title="Share"
                      >
                        <FiShare2></FiShare2>
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
                          >
                            <button
                              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                shareOnTwitter(blog.title, blog.url);
                                toggleDropdown(blog.id);
                              }}
                            >
                              <BsTwitter className="mr-2"></BsTwitter>
                              <span>Share on Twitter</span>
                            </button>
                            <button
                              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                shareOnLinkedIn(blog.url);
                                toggleDropdown(blog.id);
                              }}
                            >
                              <BsLinkedin className="mr-2"></BsLinkedin>
                              <span>Share on LinkedIn</span>
                            </button>

                            <button
                              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                copyURL(blog.url);
                                toggleDropdown(blog.id);
                              }}
                            >
                              <FiCopy className="mr-2"></FiCopy>
                              <span>Copy URL</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="mt-2 w-full rounded bg-gray-100 py-2 text-gray-700 hover:bg-gray-200"
                    onClick={() => toggleSummary(blog.id)}
                  >
                    {openSummary === blog.id ? "Hide Summary" : "Show Summary"}
                  </button>
                </div>

                <div
                  className={`mt-2 overflow-y-auto rounded p-2 text-gray-600 transition-all duration-200 ${
                    openSummary === blog.id
                      ? "max-h-50 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {blog.summary}
                </div>
                <LikeButton blogId={blog.id} userId={user?.id || null} />
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position={toast.POSITION.TOP_CENTER} />
      <div>
        {" "}
        <footer className="fixed-footer mt-12 border-t border-gray-200 bg-white py-4 shadow shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <a
                  href="https://twitter.com/IntuneUpdate"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <BsTwitter className="text-xl hover:text-blue-500" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <BsGithub className="text-xl hover:text-blue-700" />
                </a>
              </div>
              <div className="sm:text-s text-center text-sm font-semibold md:w-1/2 md:text-base">
                <a>
                  Stay up-to-date on the latest Intune related news from
                  industry experts and Microsoft, with AI generated summaries
                  and more.
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <a
                  href="https://ugurkoc.de/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Privacy Policy"
                >
                  <MdPrivacyTip className="text-xl hover:text-blue-500" />
                </a>
                <a
                  href="https://ugurkoc.de/imprint/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Imprint"
                >
                  <GrCompliance className="text-xl hover:text-blue-700" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
