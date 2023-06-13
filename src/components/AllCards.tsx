import React, { useEffect, useState, useMemo } from "react";
import { getBlogs } from "../getBlogs";
import { getVideos } from "../getVideos";
import { getMSBlogs } from "../getMSBlogs";
import { getIntuneMSBlogs } from "~/getIntuneMSBlogs";
import { getWindowsBlogs } from "~/getWindowsBlogs";
import { useUser } from "@clerk/clerk-react";
import { getUserBookmarks, addBookmark, removeBookmark } from "../bookmark";
import YoutubeVideoCard from "../components/YoutubeVideoCard";
import BlogPostCard, { BlogData } from "../components/BlogPostCard";
import MSBlogPostCard, { MSBlogPostData } from "~/components/MSBlogPostCard";
import IntuneMSBlogPostCard, {
  IntuneMSBlogPostData,
} from "~/components/IntuneMSBlogPostCard";
import WindowsBlogPostCard, {
  WindowsBlogPostData,
} from "~/components/WindowsBlogPostCard";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowUp } from "react-icons/fa";
import DropdownMenu from "../components/DropdownShare";
import SearchBox from "../components/SearchBox";
import InfiniteScroll from "react-infinite-scroll-component";
import loading_animated from "../assets/loading_animated.json";
import Lottie from "lottie-react";

interface VideoData {
  id: number;
  url: string;
  author: string;
  title: string;
  createdAt: string;
}

interface Item {
  itemType: string;
  date: Date;
  id: number;
  url: string;
  author: string;
  title: string;
  createdAt: string;
}

function AllCards() {
  const { user, isSignedIn } = useUser();
  const [uniqueAuthors, setUniqueAuthors] = useState<string[]>(["All"]);
  const [userBookmarks, setUserBookmarks] = useState<Record<number, boolean>>(
    {}
  );
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [msBlogs, setMSBlogs] = useState<MSBlogPostData[]>([]);
  const [IntunemsBlogs, setIntuneMSBlogs] = useState<IntuneMSBlogPostData[]>(
    []
  );
  const [WindowsBlogs, setWindowsBlogs] = useState<WindowsBlogPostData[]>([]);

  const [isScrolling, setIsScrolling] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(12);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          blogData,
          msBlogData,
          videoData,
          IntunemsBlogPosts,
          WindowsBlogPosts,
        ] = await Promise.all([
          getBlogs(),
          getMSBlogs(),
          getVideos(),
          getIntuneMSBlogs(),
          getWindowsBlogs(),
        ]);

        /*         console.log("Blog data: ", blogData);
        console.log("MSBlog data: ", msBlogData);
        console.log("Video data: ", videoData);
        console.log("IntuneMSBlog data: ", IntunemsBlogPosts);
        console.log("WindowsBlog data: ", WindowsBlogPosts); */

        setBlogs(blogData);
        setMSBlogs(msBlogData);
        setIntuneMSBlogs(IntunemsBlogPosts);
        setWindowsBlogs(WindowsBlogPosts);
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const uniqueAuthorsSet = new Set<string>(["All"]);

    blogs.forEach((blog) => {
      uniqueAuthorsSet.add(blog.author);
    });

    videos.forEach((video) => {
      uniqueAuthorsSet.add(video.author);
    });

    msBlogs.forEach((msBlog) => {
      uniqueAuthorsSet.add(msBlog.author);
    });

    IntunemsBlogs.forEach((IntunemsBlog) => {
      uniqueAuthorsSet.add(IntunemsBlog.author);
    });

    WindowsBlogs.forEach((WindowsBlog) => {
      uniqueAuthorsSet.add(WindowsBlog.author);
    });

    setUniqueAuthors(Array.from(uniqueAuthorsSet));
  }, [blogs, videos, msBlogs, IntunemsBlogs, WindowsBlogs]);

  const handleAddBookmark = async (id: number) => {
    if (user) {
      await addBookmark(user.id, id);
      setUserBookmarks({ ...userBookmarks, [id]: true });
      toast.success("Bookmark added!");
    }
  };

  const handleRemoveBookmarkLocal = async (id: number) => {
    if (user) {
      await removeBookmark(user.id, id);
      setUserBookmarks({ ...userBookmarks, [id]: false });
      toast.success("Bookmark removed!");
    }
  };

  const combinedItems = useMemo(() => {
    const sortedBlogs = blogs.map((blog) => {
      const date = blog.createdAt ? new Date(blog.createdAt) : new Date();
      return {
        ...blog,
        itemType: "blog",
        date: date,
      };
    });

    const sortedVideos = videos.map((video) => ({
      ...video,
      itemType: "video",
      date: new Date(video.createdAt),
    }));

    const msBlogPosts = msBlogs.map((msBlog) => {
      return {
        ...msBlog,
        itemType: "msblog",
        date: new Date(msBlog.date),
      };
    });

    const IntunemsBlogPosts = IntunemsBlogs.map((IntunemsBlog) => ({
      ...IntunemsBlog,
      itemType: "Intunemsblog",
      date: new Date(IntunemsBlog.date),
    }));

    const WindowsBlogPosts = WindowsBlogs.map((WindowsBlog) => ({
      ...WindowsBlog,
      itemType: "Windowsblog",
      date: new Date(WindowsBlog.date),
    }));

    const allItems = [
      ...sortedBlogs,
      ...sortedVideos,
      ...msBlogPosts,
      ...IntunemsBlogPosts,
      ...WindowsBlogPosts,
    ];

    allItems.sort((a, b) => b.date.valueOf() - a.date.valueOf());

    return allItems;
  }, [videos, msBlogs, IntunemsBlogs, WindowsBlogs]);

  const [filteredItemsState, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    setFilteredItems(combinedItems);
  }, [combinedItems]);

  const loadMore = () => {
    setItemsPerPage((prevItemsPerPage) => prevItemsPerPage + 12);
  };

  const visibleItems = combinedItems.slice(0, itemsPerPage);

  return (
    <div className="ml-5 mr-5 pb-20">
      <InfiniteScroll
        dataLength={visibleItems.length}
        next={loadMore}
        hasMore={visibleItems.length < combinedItems.length}
        loader={
          <div>
            <Lottie animationData={loading_animated} />
          </div>
        }
      >
        <div className="grid-auto-rows minmax(100px, auto) ml-2 mr-2 grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {" "}
          {visibleItems.map((item, index) => {
            if (!item) {
              return null;
            }
            return (
              <div key={item.id}>
                {item.itemType === "blog" && (
                  <BlogPostCard
                    blog={item}
                    userBookmarks={userBookmarks}
                    handleBookmark={handleAddBookmark}
                    handleRemoveBookmark={handleRemoveBookmarkLocal}
                    id={0}
                    title={""}
                    url={""}
                    author={""}
                    createdAt={""}
                    userId={null}
                  />
                )}

                {item.itemType === "msblog" && (
                  <MSBlogPostCard
                    blog={item}
                    userBookmarks={userBookmarks}
                    handleBookmark={handleAddBookmark}
                    handleRemoveBookmark={handleRemoveBookmarkLocal}
                    id={0}
                    title={""}
                    url={""}
                    author={""}
                    createdAt={""}
                    userId={null}
                  />
                )}

                {item.itemType === "Intunemsblog" && (
                  <IntuneMSBlogPostCard
                    blog={item}
                    userBookmarks={userBookmarks}
                    handleBookmark={handleAddBookmark}
                    handleRemoveBookmark={handleRemoveBookmarkLocal}
                    id={0}
                    title={""}
                    url={""}
                    author={""}
                    createdAt={""}
                    userId={null}
                  />
                )}

                {item.itemType === "Windowsblog" && (
                  <WindowsBlogPostCard
                    blog={item}
                    userBookmarks={userBookmarks}
                    handleBookmark={handleAddBookmark}
                    handleRemoveBookmark={handleRemoveBookmarkLocal}
                    id={0}
                    title={""}
                    url={""}
                    author={""}
                    createdAt={""}
                    userId={null}
                  />
                )}

                {item.itemType === "video" && (
                  <YoutubeVideoCard
                    id={item.id}
                    title={item.title}
                    url={item.url}
                    author={item.author}
                    createdAt={item.createdAt}
                    userId={user?.id ?? null}
                  />
                )}
                {isScrolling && (
                  <div
                    className="fixed bottom-10 right-0 z-50 mb-4 mr-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    <FaArrowUp />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default AllCards;
