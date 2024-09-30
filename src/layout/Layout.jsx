import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Layout(props) {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col w-full overflow-y-scroll">
          <Navbar />
          <main className="flex-grow bg-[#e3effe] pt-[5rem]">
            <div className="lg:px-8 px-4 lg:py-4 py-2">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Layout;
