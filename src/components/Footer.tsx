import React from "react";
import { BsTwitter } from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import { MdPrivacyTip } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";

const Footer: React.FC = () => (
  <footer className="fixed-footer mt-12 border-t border-gray-200 bg-white py-4 shadow shadow-lg">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <a
            href="https://twitter.com/ugurkocde"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            title="Follow me on Twitter"
          >
            <BsTwitter className="text-xl hover:text-blue-500" />
          </a>
          <a
            href="https://twitter.com/messages/compose?recipient_id=1465361386293374988"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
            title="Message me on Twitter"
          >
            <AiFillMessage className="text-xl hover:text-blue-500" />
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://ugurkoc.de/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Privacy Policy"
            title="Privacy Policy"
          >
            <MdPrivacyTip className="text-xl hover:text-blue-500" />
          </a>
          <a
            href="https://ugurkoc.de/imprint/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Imprint"
            title="Imprint"
          >
            <GrCompliance className="text-xl hover:text-blue-700" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
