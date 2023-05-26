import React, { useEffect, useState, useMemo, useRef } from "react";
import type { NextPage } from "next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdPrivacyTip } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";

import { BsTwitter } from "react-icons/bs";

import AllCards from "~/components/AllCards";
import Header from "~/components/Header";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Header />
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
