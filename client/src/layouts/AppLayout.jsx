import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer"; // Import Footer
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-64 bg-gray-800 text-white h-full sticky top-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="shadow-md sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-4 bg-gray-100">
            <Outlet />
          </main>
          <Footer className="bg-white shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
