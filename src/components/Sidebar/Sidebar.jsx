import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { SnippetsOutlined } from "@ant-design/icons";
import { HiOfficeBuilding } from "react-icons/hi";
import { BiCategory } from "react-icons/bi";
import { IoMdPeople } from "react-icons/io";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { GrResources } from "react-icons/gr";
import { useSidebarCollapse } from "../../zustand/SidebarCollapseStore";

const items = [
  {
    key: "1",
    icon: <BiCategory style={{ fontSize: "1.2rem" }} />,
    label: "Categories",
    link: "/",
  },
  {
    key: "2",
    icon: <IoMdPeople style={{ fontSize: "1.2rem" }} />,
    label: "Faqs",
    link: "/faqs",
  },
  {
    key: "3",
    icon: <SnippetsOutlined style={{ fontSize: "1.2rem" }} />,
    label: "News",
    link: "/news",
  },
  {
    key: "4",
    icon: <HiOfficeBuilding style={{ fontSize: "1.2rem" }} />,
    label: "Blogs",
    link: "/blogs",
  },
  {
    key: "5",
    icon: <MdOutlineMiscellaneousServices style={{ fontSize: "1.2rem" }} />,
    label: "Services",
    link: "/services",
  },
  {
    key: "6",
    icon: <GrResources style={{ fontSize: "1.2rem" }} />,
    label: "Sources",
    link: "/sources",
  },
];

function Sidebar(props) {
  const { isSidebarCollapse } = useSidebarCollapse();
  const navigate = useNavigate();

  const handleMenuItem = (e) => {
    const clickedItem = items.find((i) => i.key === e.key);

    if (clickedItem) {
      navigate(clickedItem.link);
    }
  };

  return (
    <div
      className={`relative z-20 h-screen bg-[#001529] pt-4 transition-all duration-500 ${
        isSidebarCollapse ? "w-20" : "w-80"
      }`}
    >
      <a href="/" className="transition-all duration-500">
        {isSidebarCollapse ? (
          <img
            src="https://autozoom-admin-nine.vercel.app/assets/autozoom-CM99tOti.svg"
            alt="logo"
            className="mb-6 px-2"
          />
        ) : (
          <p className="text-[#a6adb4] hover:text-white text-center lg:text-2xl font-semibold">
            UzLoyalAdmin
          </p>
        )}
      </a>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={isSidebarCollapse}
        items={items}
        className="transition-all duration-500 font-medium"
        onClick={handleMenuItem}
      />
    </div>
  );
}

export default Sidebar;
