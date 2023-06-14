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
import Footer from "~/components/Footer";

const Home: NextPage = () => {
  useEffect(() => {
    // After the component is mounted, get the saved scroll position
    const savedScrollPosition = localStorage.getItem("scrollPosition");

    // If there was a saved scroll position, use it
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }

    const handleScroll = () => {
      // Whenever the user scrolls, save the current scroll position
      localStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className="mb-4 pt-16">
        <Header title="Intune Update" />
      </div>

      <AllCards />

      <ToastContainer position={toast.POSITION.TOP_CENTER} />

      <Footer />
    </div>
  );
};

export default Home;
