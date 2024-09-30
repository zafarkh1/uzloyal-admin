import React from "react";
import { useSidebarCollapse } from "../../zustand/SidebarCollapseStore";

function Footer(props) {
  const { isSidebarCollapse } = useSidebarCollapse();

  return (
    <div className="fixed z-10 right-0 bottom-0 w-full shadow-lg bg-white">
      <div
        className={`flex justify-center items-center h-12 ${
          isSidebarCollapse ? "ml-[5rem]" : "ml-[16.6rem]"
        }`}
      >
        <span className="text-[#3e3e3e] text-center px-4 lg:text-base text-sm">
          © Copyright Autozoom.uz 2023-2024
        </span>
      </div>
    </div>
  );
}

export default Footer;
