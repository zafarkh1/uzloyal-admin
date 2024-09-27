import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Layout(props) {
  return (
    <div className="flex h-screen relative">
      {" "}
      <Sidebar />
      <div className="flex flex-col w-full overflow-y-scroll">
        <Navbar />
        <main className="flex-grow bg-[#e3effe]">
          <div className="px-8 py-4 my-24">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
