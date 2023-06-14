import React, { useEffect, useState } from "react";
import { useTrail, animated } from "@react-spring/web";
import {
  BsTwitter,
  BsFillPersonFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import { MdPrivacyTip, MdOpenInNew } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import Link from "next/link";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { FaArrowUp } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Tools: React.FC = () => {
  const toolsData = [
    {
      title: "IntuneManagement",
      author: "Mikael Karlsson",
      author_website: "https://www.linkedin.com/in/mikael-karlsson-66154326",
      website: "https://github.com/Micke-K/IntuneManagement",
      overview:
        "IntuneManagement is a tool that simplifies the backup and cloning of entire Intune environments. It provides scripts that can export and import various objects, including assignments, allowing for easy migration between tenants. During the export process, a migration table is created to track assignments, which can be used during the import process in different environments. Additionally, the tool can create missing groups in the target environment during import, preserving group information such as name, description, and type, including support for dynamic groups. Furthermore, IntuneManagement supports dependencies between objects. For example, it can handle dependencies like App Protection depending on an App, Policy Sets depending on Compliance Policies, and objects with Scope Tags. To ensure successful import, the tool utilizes the exported JSON files to obtain the necessary IDs and names of the exported objects. It then updates the IDs accordingly before importing objects from the JSON files. The Bulk Import form displays the order in which objects will be imported, with those having the lowest order number imported first. In summary, IntuneManagement offers a comprehensive solution for backing up, cloning, and migrating Intune environments, providing support for object export/import, assignment migration, group creation, and handling object dependencies.",
      imageUrl:
        "https://raw.githubusercontent.com/Micke-K/IntuneManagement/master/IntuneManagement.PNG",
    },
    {
      title: "OSDCloud",
      author: "David Segura",
      author_website: "https://www.osdcloud.com/",
      website: "https://osdcloud.osdeploy.com/",
      overview:
        "OSDCloud is a tool designed for deploying Windows 10/11 x64 operating system over the internet using the OSD PowerShell Module. It simplifies the deployment process by leveraging WinPE (Windows Preinstallation Environment) to wipe and partition the OSDisk. The tool then downloads the Windows Operating System directly from Microsoft Update using CuRL. Once downloaded, the OS is staged (expanded) on the OSDisk. To ensure hardware compatibility, OSDCloud downloads Driver Packs from manufacturers such as Dell, Lenovo, and HP. These Driver Packs can be installed either in WinPE or during the Windows Specialize Phase. In cases where a specific Driver Pack is not available, the tool retrieves hardware drivers from Microsoft Update. This broad compatibility makes OSDCloud suitable for deployment on various computer models.",
      imageUrl:
        "https://www.recastsoftware.com/wp-content/uploads/2022/02/image-8-1024x724.png",
    },
    {
      title: "IntuneCD",
      author: "Tobias Almen",
      author_website: "https://almenscorner.io/",
      website: "https://almenscorner.io/introducing-intunecd-tool/",
      overview:
        "IntuneCD or, Intune Continuous Delivery as it stands for is a Python package that is used to back up and update configurations in Intune. It was created with running it from a pipeline in mind. Using this approach we get complete history of which configurations have been changed and what setting has been changed.The main function is to back up configurations from Intune to a Git repository from a DEV environment and if any configurations has changed, push them to PROD Intune environment. The package can also be run standalone outside a pipeline, or in one to only backup data.",
      imageUrl:
        "https://user-images.githubusercontent.com/78877636/204646551-4a2540ab-b69c-489d-a463-e335ff0f52cb.png",
    },
    {
      title: "SyncMLViewer",
      author: "Oliver Kieselbach",
      author_website: "https://oliverkieselbach.com/",
      website:
        "https://oliverkieselbach.com/2019/10/11/windows-10-mdm-client-activity-monitoring-with-syncml-viewer/",
      overview:
        "This tool is able to present the SyncML protocol stream between the Windows 10 client and management system. In addition it does some extra parsing to extract details and make the analyzing a bit easier. The tool uses ETW to trace the MDM Sync session. In general the tool can be very handy to troubleshoot policy issues. Tracing what the client actually sends and receives provides deep protocol insights. Verifying OMA-URIs and data field definitions. It makes it easy to get confirmation about queried or applied settings.",
      imageUrl:
        "https://oliverkieselbach.files.wordpress.com/2019/10/image-3.png?w=1024",
    },
    {
      title: "Intune Debug Toolkit",
      author: "MSEndpointMgr",
      author_website: "https://msendpointmgr.com",
      website: "https://github.com/MSEndpointMgr/IntuneDebugToolkit",
      overview:
        "Intune Debug Toolkit is a community developed solution, maintained by Mattias Melkersen from MSEndpointMgr including community members Oliver Kieselbach (@okieselb), Rudy Ooms (@Mister_MDM) and David Just (@DavidJu14353759), Jannik Reinhard (@jannik_reinhard), Ondrej Šebela (@AndrewZtrhgf), David Segura (@SeguraOSD) and Petri Paavola (@petripaavola) aiming at providing better and easier debug possibilities on devices co-managed or Intune managed only.",
      imageUrl:
        "https://msendpointmgr.com/wp-content/uploads/2022/10/image-29-1536x485.png",
    },
  ];

  const trail = useTrail(toolsData.length, {
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
  });

  useEffect(() => {
    document.title = "Intune Update - Tools";
  }, []);

  const [selectedToolIndex, setSelectedToolIndex] = useState<number | null>(
    null
  );

  const onToolClick = (index: number) => {
    setSelectedToolIndex(index);
  };

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!isScrolling && window.pageYOffset > 400) {
        setIsScrolling(true);
      } else if (isScrolling && window.pageYOffset <= 400) {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [isScrolling]);

  return (
    <div className="container mx-auto pb-20">
      <div className="mb-4 pt-16">
        <Header title="Community Tools" />
      </div>

      <div className="align-center flex">
        <Link
          href="/"
          className="text-black-500 mb-5 ml-5 flex items-center space-x-2 hover:text-blue-500"
          title="Back to Home"
        >
          <IoArrowBackCircleSharp size={28} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div
        className="gap-8 lg:grid lg:grid-cols-4"
        style={{ position: "relative" }}
      >
        <div className="mb-4 flex flex-col space-y-2 pl-4 lg:sticky lg:top-4 lg:mb-0">
          <h2 className="text-xl font-bold"></h2>
          {toolsData.map((tool, index) => (
            <a
              href={`#tool-${index}`}
              key={index}
              className="my-2 flex items-center"
              onClick={() => onToolClick(index)}
            >
              {selectedToolIndex === index && (
                <BsFillArrowRightCircleFill className="mr-2" />
              )}
              {tool.title}
            </a>
          ))}
        </div>

        <div
          className="grid gap-8 overflow-auto lg:col-span-3"
          style={{ maxHeight: "80vh" }}
        >
          {trail.map((style, index) => (
            <animated.div key={index} style={style} id={`tool-${index}`}>
              <div className="bg-white p-4 shadow">
                <h1 className="mb-2 text-4xl font-bold">
                  {toolsData[index]?.title}
                </h1>
                <div className="mb-4 flex justify-start space-x-4">
                  <a
                    href={toolsData[index]?.author_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <BsFillPersonFill className="mr-2" />
                    {toolsData[index]?.author}
                  </a>
                  <a
                    href={toolsData[index]?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <MdOpenInNew className="mr-2" />
                    Website
                  </a>
                </div>
                <p className="mb-4">{toolsData[index]?.overview}</p>
                <img
                  src={toolsData[index]?.imageUrl}
                  alt={toolsData[index]?.title}
                  className="w-full"
                />
              </div>
            </animated.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tools;
