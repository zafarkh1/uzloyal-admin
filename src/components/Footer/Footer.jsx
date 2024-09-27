import React from "react";
import { useSidebarCollapse } from "../../zustand/SidebarCollapseStore";

function Footer(props) {
  const { isSidebarCollapse } = useSidebarCollapse();

  return (
    <div
      className={`absolute z-10 right-0 bottom-0 shadow-lg bg-white flex justify-center items-center h-12 ${
        isSidebarCollapse ? "left-[5rem]" : "left-[16.6rem]"
      }`}
    >
      <span className="text-[#3e3e3e] text-center px-4">
        © Copyright Autozoom.uz 2023-2024
      </span>
    </div>
  );
}

export default Footer;
