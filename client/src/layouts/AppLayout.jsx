import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer"; // Import Footer
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
