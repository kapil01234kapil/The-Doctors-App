"use client";

import React from "react";
import { useSelector } from "react-redux";
import SideBar from "../doctor/SideBar";
import DoctorNavabr from "../doctor/DoctorNavabr";
import Sidebar from "../admin/Sidebar"; // Admin Sidebar
import Header from "../admin/Header"; // Admin Header
import Navbar from "./Navbar";
import Footer from "./Footer";

const FinalLayout = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  return (
    <>
      {user?.role === "doctor" ? (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 z-40 h-screen bg-[#4D91FF] overflow-y-auto scrollbar-hide
            w-1/4 sm:w-1/5 md:w-1/6 lg:w-1/6">
            <SideBar />
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col ml-[25%] sm:ml-[20%] md:ml-[16.6667%] min-h-screen">
            {/* Header */}
            <header className="w-full sticky top-0 z-50">
              <DoctorNavabr />
            </header>

            {/* Page content */}
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      ) : user?.role === "admin" ? (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden lg:block fixed top-0 left-0 z-40 h-screen overflow-y-auto scrollbar-hide w-64">
            <Sidebar  />
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col lg:ml-64">
            <header className="w-full sticky top-0 z-50">
              <Header />
            </header>

            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      ) : (
        <div
          className="min-h-screen h-full bg-blue-50 w-full bg-cover bg-center bg-no-repeat relative flex flex-col"
          style={{ backgroundImage: "url('/curve-lines.png')" }}
        >
          <Navbar/>
          {children}
          <Footer/>
        </div>
      )}
    </>
  );
};

export default FinalLayout;
