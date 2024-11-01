import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
const AdminHome = ({ children }) => {
  return (
    <div className="flex items-start min-h-screen">
      <div className="flex items-start min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 h-screen overflow-y-scroll bg-[#412C3A] w-[85%]">
          <Navbar />
          <ToastContainer />

          <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
