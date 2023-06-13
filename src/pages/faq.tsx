import React from "react";
import { useEffect } from "react";
import { useTrail, animated } from "@react-spring/web";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Link from "next/link";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const FAQ: React.FC = () => {
  const faqData = [
    {
      question: "What is Intune Update?",
      answer:
        "Intune Update is a website that provides the latest news and updates about Microsoft Intune, a cloud-based endpoint management solution.",
    },
    {
      question: "How often is the content updated?",
      answer:
        "The content on Intune Update is updated regularly to ensure you have access to the most recent news and information about Microsoft Intune.",
    },
    {
      question: "Can I bookmark articles or videos?",
      answer:
        "Yes, if you are signed in, you can bookmark articles or videos by clicking on the bookmark icon next to each item. You can access your bookmarks later in the 'My Bookmarks' section.",
    },
    {
      question: "Is Intune Update free to use?",
      answer:
        "Yes, Intune Update is completely free to use. You can access all the content and features without any cost.",
    },
    {
      question: "How can I contribute to Intune Update?",
      answer:
        "If you have news or updates about Microsoft Intune that you would like to share, you can contact us through the website. We welcome contributions from the community.",
    },
    {
      question: "Can I suggest new features for Intune Update?",
      answer:
        "Yes, we value user feedback and suggestions. If you have ideas for new features or improvements, please let us know through the website or our social media channels.",
    },
    {
      question: "How can I report a bug or issue?",
      answer:
        "If you encounter a bug or issue while using Intune Update, please report it to us through the website. We appreciate your help in improving the user experience.",
    },
    {
      question: "Can I share articles or videos from Intune Update?",
      answer:
        "Yes, you can share articles or videos from Intune Update with others. Each item has social media sharing buttons that allow you to share the content on various platforms.",
    },
    {
      question: "Is there a mobile app for Intune Update?",
      answer:
        "Currently, Intune Update is only available as a website. However, the website is optimized for mobile devices, allowing you to access the content on your smartphone or tablet.",
    },
    {
      question: "How can I contact the Intune Update team?",
      answer:
        "If you need to contact the Intune Update team for any reason, you can reach us through the contact form on the website. We will respond to your inquiry as soon as possible.",
    },
    {
      question: "Can I access content without signing in?",
      answer:
        "Yes, you can access all the content on Intune Update without signing in. However, you will not be able to bookmark items or access your bookmarks without signing in.",
    },
    {
      question: "How do I remove a bookmark?",
      answer:
        "To remove a bookmark, click on the bookmark icon next to the item. The bookmark will be removed from your list of bookmarks.",
    },
  ];

  const trail = useTrail(faqData.length, {
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
  });

  useEffect(() => {
    document.title = "Intune Update - FAQ";
  }, []);

  return (
    <div className="container mx-auto pb-20">
      <Header title="FAQ" />
      <div className="mb-4">
        <div className="align-center flex">
          <Link
            href="/"
            className="text-black-500 ml-5 flex items-center space-x-2 hover:text-blue-500"
            title="Back to Home"
          >
            <IoArrowBackCircleSharp size={28} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
      <div className="grid gap-4">
        {trail.map((style, index) => (
          <animated.div
            key={index}
            style={style}
            className="bg-white p-4 shadow"
          >
            <h2 className="mb-2 text-xl font-bold">
              {faqData[index]?.question}
            </h2>
            <p>{faqData[index]?.answer}</p>
          </animated.div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
