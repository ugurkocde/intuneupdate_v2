import React from "react";
import { useEffect } from "react";
import { useTrail, animated } from "@react-spring/web";
import { BsTwitter } from "react-icons/bs";
import { MdPrivacyTip } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import Link from "next/link";

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
    // Add more FAQ data as needed
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
      <h1 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h1>
      <li className="mr-4">
        <Link href="/">
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Homepage
          </button>
        </Link>
      </li>
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

export default FAQ;
