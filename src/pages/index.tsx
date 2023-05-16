import React, { useEffect, useState, useMemo, useRef } from "react";
import type { NextPage } from "next";
import { getBlogs } from "../getBlogs";
import { getVideos } from "../getVideos";
import { getMSBlogs } from "../getMSBlogs";
import { useUser } from "@clerk/clerk-react";
import { getUserBookmarks, addBookmark, removeBookmark } from "../bookmark";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import YoutubeVideoCard from "../components/YoutubeVideoCard";
import BlogPostCard, { BlogData } from "../components/BlogPostCard";
import MSBlogPostCard from "~/components/MSBlogPostCard";
import { MdPrivacyTip } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import { HiOutlineSelector } from "react-icons/hi";
import { BsTwitter, BsBookmarkPlusFill, BsTools } from "react-icons/bs";
import { FcFaq } from "react-icons/fc";
import { useSpring, animated } from "@react-spring/web";
import { BsLinkedin } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";

interface VideoData {
  id: number;
  url: string;
  author: string;
  title: string;
  createdAt: string;
}

interface item {
  itemType: string;
  date: Date;
  id: number;
  url: string;
  author: string;
  title: string;
  createdAt: string;
}

const Home: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueAuthors, setUniqueAuthors] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<{
    blogBookmarks: { [x: string]: any }[];
    videoBookmarks: { [x: string]: any }[];
  }>({
    blogBookmarks: [],
    videoBookmarks: [],
  });

  const [userBookmarks, setUserBookmarks] = useState<Record<number, boolean>>(
    {}
  );
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const { user, isSignedIn } = useUser();
  const [msBlogs, setMSBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      setBlogs(data);
    };
    fetchBlogs();
  }, []); // <-- Remove `user` dependency from this useEffect

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getMSBlogs();
      setMSBlogs(data);
    };
    fetchBlogs();
  }, []); // <-- Remove `user` dependency from this useEffect

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (isSignedIn && user) {
        const bookmarks = await getUserBookmarks(user.id);
        setUserBookmarks(bookmarks || {});
      }
    };
    fetchUserBookmarks();
  }, [isSignedIn, user]); // <-- Add `isSignedIn` dependency to this useEffect

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        const data = await getUserBookmarks(user.id);
        setBookmarks(data || { blogBookmarks: [], videoBookmarks: [] });
      }
    };
    fetchBookmarks();
  }, [user]); // <-- Remove `userBookmarks` dependency from this useEffect

  useEffect(() => {
    const uniqueAuthorsSet = new Set<string>();
    blogs.forEach((blog) => {
      uniqueAuthorsSet.add(blog.author);
    });
    setUniqueAuthors(Array.from(uniqueAuthorsSet));
  }, [blogs]);

  const [filteredBlogs, setFilteredBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    const filterBlogs = () => {
      let filtered = blogs;
      if (searchTerm) {
        filtered = filtered.filter((blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedAuthor) {
        filtered = filtered.filter(
          (blog) => blog.author.toLowerCase() === selectedAuthor.toLowerCase()
        );
      }
      setFilteredBlogs(filtered); // Set the filtered blogs using the setter function
    };

    filterBlogs();
  }, [blogs, searchTerm, selectedAuthor]);

  const handleBookmark = async (id: number) => {
    if (user) {
      await addBookmark(user.id, id);
      setUserBookmarks({ ...userBookmarks, [id]: true });
      toast.success("Bookmark added!");
    }
  };

  const handleRemoveBookmark = async (id: number) => {
    if (user) {
      await removeBookmark(user.id, id);
      setUserBookmarks({ ...userBookmarks, [id]: false });
      toast.success("Bookmark removed!");
    }
  };

  const [openSummary, setOpenSummary] = useState<number | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const authorDropdownRef = useRef<HTMLSelectElement>(null);

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

  const [isLoading, setIsLoading] = useState(true);

  const combinedItems = useMemo(() => {
    const sortedBlogs = filteredBlogs.map((blog) => ({
      ...blog,
      itemType: "blog",
      date: blog.releaseDate ? new Date(blog.releaseDate) : new Date(),
    }));

    const sortedVideos = videos.map((video) => ({
      ...video,
      itemType: "video",
      date: new Date(video.createdAt),
    }));

    const msBlogPosts = msBlogs.map((msBlog) => ({
      ...msBlog,
      itemType: "msblog",
    }));

    const allItems = [...sortedBlogs, ...sortedVideos, ...msBlogPosts];
    allItems.sort((a, b) => b.date.valueOf() - a.date.valueOf());

    // Interleave the sorted blog posts, videos, and msBlogPosts
    const interleavedItems = [];
    const maxLength = Math.max(
      sortedBlogs.length,
      sortedVideos.length,
      msBlogPosts.length
    );
    for (let i = 0; i < maxLength; i++) {
      if (sortedBlogs[i]) {
        interleavedItems.push(sortedBlogs[i]);
      }
      if (sortedVideos[i]) {
        interleavedItems.push(sortedVideos[i]);
      }
      if (msBlogPosts[i]) {
        interleavedItems.push(msBlogPosts[i]);
      }
    }

    return interleavedItems;
  }, [filteredBlogs, videos, msBlogs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogData = await getBlogs();
        setBlogs(blogData);
        const msBlogData = await getMSBlogs();
        setMSBlogs(msBlogData);
        const videoData = await getVideos();
        setVideos(videoData);
        setIsLoading(false); // <-- Set `isLoading` to `false` after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const loader = useRef(null);
  const initialItemsCount = 18;
  const [displayedItems, setDisplayedItems] = useState<
    Array<
      | {
          itemType: string;
          date: Date;
          id: number;
          url: string;
          author: string;
          title: string;
          createdAt: string;
        }
      | undefined
    >
  >([]);

  const [hasMoreItems, setHasMoreItems] = useState(true);

  useEffect(() => {
    setDisplayedItems(combinedItems.slice(0, initialItemsCount));
  }, [combinedItems]);

  const loadMoreItems = () => {
    const currentItemsCount = displayedItems.length;

    if (currentItemsCount >= combinedItems.length) {
      setHasMoreItems(false);
      return;
    }

    const newItems = combinedItems.slice(
      currentItemsCount,
      currentItemsCount + initialItemsCount
    );

    setDisplayedItems((prevItems) => {
      if (prevItems === null) {
        return newItems;
      }

      return [...prevItems, ...newItems];
    });

    // Trigger fade-out animation
    setReachedBottom(false);
  };

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entities) => {
      const target = entities[0];
      if (target && target.isIntersecting) {
        console.log("Intersection:", target.isIntersecting);
        loadMoreItems();
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    // Clean up the observer when it changes or when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [loader.current]);

  const [reachedBottom, setReachedBottom] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const distanceFromBottom = 200; // Adjust this value as needed

    setReachedBottom(
      scrollPosition >=
        document.documentElement.scrollHeight - distanceFromBottom
    );
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeAnimation = useSpring({
    opacity: reachedBottom ? 1 : 0,
    transform: `translateY(${reachedBottom ? 0 : 20}px)`,
    visibility: reachedBottom ? "visible" : "hidden",
    config: { duration: 500 },
  });

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const showThreshold = 200; // Adjust this value as needed

      setIsVisible(scrollPosition > showThreshold);
    };

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <button
        onClick={handleScrollToTop}
        className="fixed bottom-16 right-8 z-50 rounded bg-blue-500 p-2 text-white"
        style={{
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? "visible" : "hidden",
        }}
      >
        &#8593; {/* Up arrow */}
      </button>
    );
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
            <div className="flex items-center">
              <div>
                <Link href="/faq">
                  <button className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700">
                    <FcFaq />
                  </button>
                </Link>
              </div>
              <div>
                <Link href="/tools">
                  <button className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700">
                    <BsTools />
                  </button>
                </Link>
              </div>
              <div>
                <Link
                  href="https://www.linkedin.com/groups/8761296/"
                  target="_blank"
                  title="Modern Endpoint Management LinkedIn Group"
                >
                  <button className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700">
                    <BsLinkedin />
                  </button>
                </Link>
              </div>
              <div>
                <Link
                  href="https://andrewstaylor.com/"
                  target="_blank"
                  title="Newsletter"
                >
                  <button className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700">
                    <IoNewspaperOutline />
                  </button>
                </Link>
              </div>
            </div>
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
                  <li className="mr-4 hidden sm:block">
                    <Link href="/bookmarks">
                      <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        My Bookmarks
                      </button>
                    </Link>
                  </li>
                  <li className="mr-4 block sm:hidden">
                    <Link href="/bookmarks">
                      <button className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700">
                        <BsBookmarkPlusFill />
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
          <div className="relative inline-block">
            <button
              className="rounded border border-gray-300 px-4 py-2 font-bold hover:border-gray-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedFilter}
            </button>
            {dropdownOpen && (
              <div
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
                    className="w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter("All");
                      setDropdownOpen(false);
                    }}
                  >
                    All
                  </button>
                  <button
                    className="w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter("Community Blogs");
                      setDropdownOpen(false);
                    }}
                  >
                    Community Blogs
                  </button>
                  <button
                    className="w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter("Microsoft Blogs");
                      setDropdownOpen(false);
                    }}
                  >
                    Microsoft Blogs
                  </button>
                  <button
                    className="w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter("GitHub Updates");
                      setDropdownOpen(false);
                    }}
                  >
                    GitHub Updates
                  </button>
                  <button
                    className="w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter("YouTube");
                      setDropdownOpen(false);
                    }}
                  >
                    YouTube
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {displayedItems.map((item, index) => {
          if (!item) {
            return null;
          }

          const isLastItem = displayedItems.length === index + 1;

          return (
            <div key={item.id}>
              {item.itemType === "blog" && (
                <BlogPostCard
                  ref={isLastItem ? loader : null}
                  blog={item}
                  userBookmarks={userBookmarks}
                  handleBookmark={handleBookmark}
                  handleRemoveBookmark={handleRemoveBookmark}
                />
              )}

              {item.itemType === "msblog" && (
                <MSBlogPostCard
                  ref={isLastItem ? loader : null}
                  blog={item}
                  userBookmarks={userBookmarks}
                  handleBookmark={handleBookmark}
                  handleRemoveBookmark={handleRemoveBookmark}
                />
              )}

              {item.itemType === "video" && (
                <YoutubeVideoCard
                  ref={isLastItem ? loader : null}
                  id={item.id}
                  title={item.title}
                  url={item.url}
                  author={item.author}
                  createdAt={item.createdAt}
                  userId={user?.id ?? null}
                />
              )}
            </div>
          );
        })}
      </div>

      {reachedBottom && hasMoreItems && (
        <animated.button
          onClick={loadMoreItems}
          className="fixed bottom-16 left-0 right-0 z-50 mx-auto rounded bg-blue-500 p-2 text-white"
          style={fadeAnimation}
        >
          Load more
        </animated.button>
      )}

      {isLoading && <div>Loading...</div>}

      <ToastContainer position={toast.POSITION.TOP_CENTER} />

      <BackToTopButton />

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
            </div>
            <div className="sm:text-s text-center text-sm font-semibold md:w-1/2 md:text-base">
              <a></a>
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
  );
};

export default Home;
