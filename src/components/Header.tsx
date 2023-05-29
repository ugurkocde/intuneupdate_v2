import React, { useEffect, useState, useMemo, useRef } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  BsBookmarkPlusFill,
  BsTools,
  BsLinkedin,
  BsFillJournalBookmarkFill,
  BsFillBookmarkFill,
} from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { ImHome } from "react-icons/im";
import Lottie from "lottie-react";
import burgermenu from "../assets/burger-menu_animated.json";

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Tell TypeScript that the ref will be used on an HTMLDivElement
  const lottieRef = useRef<any>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosing) {
      setIsOpen(false);
      setIsClosing(false);
    }
  }, [isClosing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && menuRef.current && !menuRef.current.contains(target)) {
        lottieRef.current.setDirection(-1);
        lottieRef.current.goToAndPlay(25, true);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, isOpen]);

  const handleBurgerClick = () => {
    if (isOpen) {
      lottieRef.current.setDirection(-1);
      lottieRef.current.goToAndPlay(25, true);
      setIsOpen(false);
    } else {
      lottieRef.current.setDirection(1);
      lottieRef.current.playSegments([0, 25], true);
      setIsOpen(true);
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 bg-white ${
        hasShadow ? "border-b border-gray-200 shadow shadow-lg " : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="relative ml-2" title="Menu">
            <Lottie
              lottieRef={lottieRef}
              onClick={handleBurgerClick}
              animationData={burgermenu}
              autoplay={false}
              loop={false}
              style={{ cursor: "pointer", width: 50, height: 50 }} // Adjust the size as you need
            />
            <div
              ref={menuRef}
              className="absolute mt-2 min-w-[10rem] rounded-md bg-white shadow-lg"
            >
              {isOpen && (
                <div className="absolute mt-2 flex min-w-[10rem] rounded-md bg-white shadow-lg">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                      role="menuitem"
                    >
                      <button className="flex w-full items-center font-bold">
                        {" "}
                        <ImHome />
                        <span className="ml-2">Home</span>
                      </button>
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                      role="menuitem"
                    >
                      <button className="flex w-full items-center font-bold">
                        {" "}
                        <BsFillJournalBookmarkFill />
                        <span className="ml-2">Bookmarks</span>
                      </button>
                    </Link>
                    <Link
                      href="/faq"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                      role="menuitem"
                    >
                      <button className="flex w-full items-center font-bold">
                        {" "}
                        <FaQuestionCircle />
                        <span className="ml-2">FAQ</span>
                      </button>
                    </Link>
                    <Link
                      href="/tools"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                      role="menuitem"
                    >
                      <button className="flex w-full items-center font-bold">
                        {" "}
                        <BsTools />
                        <span className="ml-2">Tools</span>
                      </button>
                    </Link>
                    <a
                      href="https://www.linkedin.com/groups/8761296/"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                      role="menuitem"
                    >
                      <button className="flex w-full items-center font-bold">
                        {" "}
                        <BsLinkedin />
                        <span className="ml-2">LinkedIn Group</span>
                      </button>
                    </a>
                    <a
                      href="https://andrewstaylor.com/"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                      role="menuitem"
                    >
                      <button className="flex w-full items-center font-bold">
                        {" "}
                        <IoNewspaperOutline />
                        <span className="ml-2">Newsletter</span>
                      </button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full text-center">
            <h1 className="mb-4 mt-2 text-4xl font-bold sm:text-5xl">
              {title}
            </h1>
          </div>
          <div className="relative mr-5">
            <ul className="flex items-center justify-end">
              <SignedOut>
                <li>
                  <Link href="/sign-in" title="Login">
                    <BiLogIn className="text-4xl" />
                  </Link>
                </li>
              </SignedOut>
              <SignedIn>
                <li className="mr-4 hidden sm:block">
                  <Link href="/bookmarks" title="Bookmarks">
                    <button className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700">
                      <BsFillBookmarkFill />
                    </button>
                  </Link>
                </li>
                <li className="mr-4 block sm:hidden">
                  <Link href="/bookmarks" title="Bookmarks">
                    <button className="rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-700">
                      <BsFillBookmarkFill />
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
