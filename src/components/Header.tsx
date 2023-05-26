import React, { useEffect, useState, useMemo, useRef } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BsTwitter, BsBookmarkPlusFill, BsTools } from "react-icons/bs";
import { FcFaq } from "react-icons/fc";
import { useSpring, animated } from "@react-spring/web";
import { BsLinkedin } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import Lottie from "lottie-react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  return (
    <div
      className={`sticky top-0 z-50 bg-white ${
        hasShadow ? "border-b border-gray-200 shadow shadow-lg " : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="relative ">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700"
            >
              Menu
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 flex w-48 w-full rounded-md bg-white shadow-lg">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link
                    href="/faq"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                    role="menuitem"
                  >
                    <button className="flex items-center font-bold">
                      <FcFaq />
                      <span className="mr-2">FAQ</span>
                    </button>
                  </Link>
                  <Link
                    href="/tools"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                    role="menuitem"
                  >
                    <button className="flex items-center font-bold">
                      <BsTools />
                      <span className="mr-2">Tools</span>
                    </button>
                  </Link>
                  <a
                    href="https://www.linkedin.com/groups/8761296/"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                    role="menuitem"
                  >
                    <button className="flex items-center font-bold">
                      <BsLinkedin />
                      <span className="mr-2">LinkedIn Group</span>
                    </button>
                  </a>
                  <a
                    href="https://andrewstaylor.com/"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                    role="menuitem"
                  >
                    <button className="flex items-center font-bold">
                      <IoNewspaperOutline />
                      <span className="mr-2">Newsletter</span>
                    </button>
                  </a>
                </div>
              </div>
            )}
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
  );
}

export default Header;
