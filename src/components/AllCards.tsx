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

interface AllCardsProps {
  filteredItems: Item[];
  userBookmarks: Record<number, boolean>;
  handleBookmark: (id: number) => void;
  handleRemoveBookmark: (id: number) => void;
  setUniqueAuthors: (authors: string[]) => void;
}

function AllCards() {
  const { user, isSignedIn } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
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
  }, []);

  useEffect(() => {
    const fetchMSBlogs = async () => {
      const data = await getMSBlogs();
      setMSBlogs(data);
    };
    fetchMSBlogs();
  }, []);

  useEffect(() => {
    const fetchWindowsBlogs = async () => {
      const data = await getWindowsBlogs();
      setWindowsBlogs(data);
    };
    fetchWindowsBlogs();
  }, []);

  useEffect(() => {
    const fetchIntuneMSBlogs = async () => {
      const data = await getIntuneMSBlogs();
      setIntuneMSBlogs(data);
    };
    fetchIntuneMSBlogs();
  }, []);

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
    const filteredData = combinedItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filteredData);
  }, [combinedItems, searchTerm]);

  const [selectedAuthor, setSelectedAuthor] = useState<string>("All");

  const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(event.target.value);
  };

  useEffect(() => {
    const filteredData = combinedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAuthor === "All" || item.author === selectedAuthor)
    );
    setFilteredItems(filteredData);
  }, [combinedItems, searchTerm, selectedAuthor]);

  return (
    <div className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
      {filteredItemsState.map((item, index) => {
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
              />
            )}

            {item.itemType === "msblog" && (
              <MSBlogPostCard
                blog={item}
                userBookmarks={userBookmarks}
                handleBookmark={handleAddBookmark}
                handleRemoveBookmark={handleRemoveBookmarkLocal}
              />
            )}

            {item.itemType === "Intunemsblog" && (
              <IntuneMSBlogPostCard
                blog={item}
                userBookmarks={userBookmarks}
                handleBookmark={handleAddBookmark}
                handleRemoveBookmark={handleRemoveBookmarkLocal}
              />
            )}

            {item.itemType === "Windowsblog" && (
              <WindowsBlogPostCard
                blog={item}
                userBookmarks={userBookmarks}
                handleBookmark={handleAddBookmark}
                handleRemoveBookmark={handleRemoveBookmarkLocal}
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
          </div>
        );
      })}
    </div>
  );
}

export default AllCards;
