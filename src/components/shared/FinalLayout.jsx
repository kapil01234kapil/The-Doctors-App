"use client";

import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import SideBar from "../doctor/SideBar";
import DoctorNavabr from "../doctor/DoctorNavabr";
import Sidebar from "../admin/Sidebar"; // Admin Sidebar
import Header from "../admin/Header"; // Admin Header
import Navbar from "./Navbar";
import Footer from "./Footer";

const FinalLayout = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const sidebarRef = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {user?.role === "doctor" ? (
        <div className="flex min-h-screen">
          {/* Doctor Sidebar */}
          <aside className="fixed top-0 left-0 z-40 h-screen w-64">
            <SideBar 
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
            />
          </aside>

          {/* Doctor Main content */}
          <div className="flex-1 flex flex-col md:ml-64">
            <header className="w-full sticky top-0 z-50">
              <DoctorNavabr onMenuClick={toggleSidebar} />
            </header>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      ) : user?.role === "admin" ? (
        <div className="flex min-h-screen">
          {/* Admin Sidebar */}
          <aside className="fixed top-0 left-0 z-40 h-screen w-64">
            <Sidebar ref={sidebarRef} />
          </aside>

          {/* Main content (shifts on laptop) */}
          <div className="flex-1 flex flex-col lg:ml-64">
            <header className="w-full sticky top-0 z-50">
              <Header onMenuClick={() => sidebarRef.current?.toggleSidebar()} />
            </header>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      ) : (
        <div
          className="min-h-screen h-full bg-white w-full bg-cover bg-center bg-no-repeat relative flex flex-col"
          style={{ backgroundImage: "url('/curve-lines.png')" }}
        >
          <Navbar />
          {children}
          <Footer />
        </div>
      )}
    </>
  );
};

export default FinalLayout;