"use client"

import React from "react";
import { useSelector } from "react-redux";
import SideBar from "../doctor/SideBar";
import DoctorNavabr from "../doctor/DoctorNavabr";
import Footer from "./Footer";
import Navbar from "./Navbar";

const FinalLayout = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
 
  return (
    <>
      {user?.role === "doctor" ? (
        <div className="flex h-full min-h-screen">
          {/* Sidebar fixed on left, scrollable */}
          <div className="w-1/6 h-full fixed top-0 left-0 overflow-y-auto scrollbar-hide">
            <SideBar />
          </div>

          {/* Right side content */}
          <div className="ml-[16.6667%] flex flex-col w-5/6">
            {/* Navbar */}
            <div className="w-full sticky top-0 z-50">
              <DoctorNavabr />
            </div>

            {/* Main content (children) */}
            <div className="flex-1 p-4">{children}</div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen h-full bg-blue-50 w-full bg-cover bg-center bg-no-repeat relative flex flex-col"
      style={{ backgroundImage: "url('/curve-lines.png')" }}>
        <Navbar/>
          {children} <Footer />
        </div>
      )}
    </>
  );
};

export default FinalLayout;
