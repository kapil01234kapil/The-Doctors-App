"use client";

import DoctorNavabr from "./DoctorNavabr";
import SideBar from "./SideBar";

const DoctorLayout = ({ children }) => {
  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar fixed on left */}
      <div className="w-1/6 md:w-1/6 h-full fixed top-0 left-0">
        <SideBar />
      </div>

      {/* Right side content */}
      <div className="ml-[33.3333%] md:ml-[16.6667%] flex flex-col w-4/6 md:w-5/6">
        {/* Navbar */}
        <div className="w-full sticky top-0 z-50">
          <DoctorNavabr />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
};

