import React, { useEffect, useState, useMemo, useRef } from "react";
import type { NextPage } from "next";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdPrivacyTip } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import { HiOutlineSelector } from "react-icons/hi";
import { BsTwitter, BsBookmarkPlusFill, BsTools } from "react-icons/bs";
import { FcFaq } from "react-icons/fc";
import { useSpring, animated } from "@react-spring/web";
import { BsLinkedin } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import Lottie from "lottie-react";
//import loading_animated from "../assets/loading_animated.json";
import backtotop from "../assets/backtotop_animated.json";
import SearchBox from "../components/SearchBox";
import DropdownMenu from "../components/DropdownShare";
import AllCards from "~/components/AllCards";
import Header from "~/components/Header";
import Head from "next/head";

const Home: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [uniqueAuthors, setUniqueAuthors] = useState<string[]>([]);

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Header />

        <div className="flex justify-center">
          <SearchBox searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="relative inline-block"></div>
          <div className="relative inline-block">
            <DropdownMenu
              options={[
                "All",
                "Community Blogs",
                "Microsoft Blogs",
                "GitHub Updates",
                "YouTube",
              ]}
              selectedOption={selectedFilter}
              onOptionSelect={setSelectedFilter}
            />
          </div>
        </div>
      </div>

      <AllCards />

      <ToastContainer position={toast.POSITION.TOP_CENTER} />

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
