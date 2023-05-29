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
  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Header title="Intune Update" />
      </div>

      <AllCards />

      <ToastContainer position={toast.POSITION.TOP_CENTER} />

      <Footer />
    </div>
  );
};

export default Home;
