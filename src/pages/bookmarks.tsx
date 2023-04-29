import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUserBookmarks } from "../bookmark";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState({});
  const { user } = useUser();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        const data = await getUserBookmarks(user.id);
        setBookmarks(data);
      }
    };
    fetchBookmarks();
  }, [user]);

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
        {Object.values(bookmarks).map((bookmark: any) => (
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
      </div>
    </div>
  );
};

export default Dashboard;
