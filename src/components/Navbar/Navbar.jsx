import { Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSidebarCollapse } from "../../zustand/SidebarCollapseStore";
import { useTokenStore } from "../../zustand/TokenStore";

function Navbar(props) {
  const { isSidebarCollapse, toggleSidebarCollapse } = useSidebarCollapse();
  const clearToken = useTokenStore((state) => state.clearToken);

  return (
    <div className="fixed z-10 right-0 top-0 w-full shadow bg-white flex sm:justify-between justify-center items-center py-4 px-8">
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapse ? "ml-[5rem]" : "ml-[16.6rem]"
        }`}
      >
        <Button
          type="primary"
          onClick={toggleSidebarCollapse}
          className="hidden sm:block"
        >
          {isSidebarCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>

      <div className="relative flex items-center gap-4 border sm:px-6 px-3 py-1 rounded-lg cursor-pointer group">
        <UserOutlined
          style={{ fontSize: "1.2rem" }}
          className="hidden sm:block"
        />
        <Button
          type="primary"
          onClick={toggleSidebarCollapse}
          className="sm:hidden"
        >
          {isSidebarCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <p className="text-xl mb-0 font-semibold">Admin</p>
        <button
          className="absolute top-full mt-2 bg-white border sm:px-6 px-3 py-2 rounded-lg cursor-pointer 
        opacity-0 group-hover:opacity-100"
          onClick={clearToken}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
