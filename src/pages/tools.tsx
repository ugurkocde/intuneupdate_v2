import React, { useEffect } from "react";
import { useTrail, animated } from "@react-spring/web";
import { BsTwitter } from "react-icons/bs";
import { MdPrivacyTip } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import Link from "next/link";

const Tools: React.FC = () => {
  const toolsData = [
    {
      title: "IntuneManagement",
      author: "Mikael Karlsson",
      website: "https://github.com/Micke-K/IntuneManagement",
      summary:
        "IntuneManagement is a tool that simplifies the backup and cloning of entire Intune environments. It provides scripts that can export and import various objects, including assignments, allowing for easy migration between tenants. During the export process, a migration table is created to track assignments, which can be used during the import process in different environments. Additionally, the tool can create missing groups in the target environment during import, preserving group information such as name, description, and type, including support for dynamic groups. Furthermore, IntuneManagement supports dependencies between objects. For example, it can handle dependencies like App Protection depending on an App, Policy Sets depending on Compliance Policies, and objects with Scope Tags. To ensure successful import, the tool utilizes the exported JSON files to obtain the necessary IDs and names of the exported objects. It then updates the IDs accordingly before importing objects from the JSON files. The Bulk Import form displays the order in which objects will be imported, with those having the lowest order number imported first. In summary, IntuneManagement offers a comprehensive solution for backing up, cloning, and migrating Intune environments, providing support for object export/import, assignment migration, group creation, and handling object dependencies.",
      imageUrl:
        "https://raw.githubusercontent.com/Micke-K/IntuneManagement/master/IntuneManagement.PNG",
    },
    {
      title: "OSDCloud",
      author: "David Segura",
      website: "https://osdcloud.osdeploy.com/",
      summary:
        "OSDCloud is a tool designed for deploying Windows 10/11 x64 operating system over the internet using the OSD PowerShell Module. It simplifies the deployment process by leveraging WinPE (Windows Preinstallation Environment) to wipe and partition the OSDisk. The tool then downloads the Windows Operating System directly from Microsoft Update using CuRL. Once downloaded, the OS is staged (expanded) on the OSDisk. To ensure hardware compatibility, OSDCloud downloads Driver Packs from manufacturers such as Dell, Lenovo, and HP. These Driver Packs can be installed either in WinPE or during the Windows Specialize Phase. In cases where a specific Driver Pack is not available, the tool retrieves hardware drivers from Microsoft Update. This broad compatibility makes OSDCloud suitable for deployment on various computer models.",
      imageUrl:
        "https://www.recastsoftware.com/wp-content/uploads/2022/02/image-8-1024x724.png",
    },
    // Add more tool data as needed
  ];

  const trail = useTrail(toolsData.length, {
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
  });

  useEffect(() => {
    document.title = "Intune Update - Tools";
  }, []);

  return (
    <div className="container mx-auto pb-20">
      <h1 className="mb-4 text-3xl font-bold">Community Tools</h1>
      <li className="mr-4">
        <Link href="/">
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Homepage
          </button>
        </Link>
      </li>
      <div className="grid gap-8">
        {trail.map((style, index) => (
          <animated.div key={index} style={style}>
            <div className="bg-white p-4 shadow">
              <h1 className="mb-2 text-4xl font-bold">
                {toolsData[index]?.title}
              </h1>
              <h3 className="mb-4">Author: {toolsData[index]?.author}</h3>
              <h3 className="mb-4">Website: {toolsData[index]?.website}</h3>
              <p className="mb-4">{toolsData[index]?.summary}</p>
              <img
                src={toolsData[index]?.imageUrl}
                alt={toolsData[index]?.title}
                className="w-full"
              />
            </div>
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

export default Tools;
