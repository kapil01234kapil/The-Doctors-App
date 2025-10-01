"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (!hydrated) {
    return <div>Loading...</div>;
  }

  // --- Doctor Layout ---
  if (user?.role === "doctor") {
    try {
      return (
        <div className="flex min-h-screen">
          {/* Doctor Sidebar */}
          <aside className="fixed top-0 left-0 z-40 h-screen w-64">
            {SideBar ? (
              <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
            ) : (
              <div>⚠️ SideBar is undefined</div>
            )}
          </aside>

          {/* Doctor Main */}
          <div className="flex-1 flex flex-col md:ml-64">
            <header className="w-full sticky top-0 z-50">
              {DoctorNavabr ? (
                <DoctorNavabr onMenuClick={toggleSidebar} />
              ) : (
                <div>⚠️ DoctorNavabr is undefined</div>
              )}
            </header>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      );
    } catch (err) {
      console.error("❌ Doctor branch failed:", err);
      return <div>Doctor branch error — check console</div>;
    }
  }

  // --- Admin Layout ---
  if (user?.role === "admin") {
    try {
      return (
        <div className="flex min-h-screen">
          {/* Admin Sidebar */}
          <aside className="fixed top-0 left-0 z-40 h-screen w-64">
            {Sidebar ? <Sidebar ref={sidebarRef} /> : <div>⚠️ Sidebar is undefined</div>}
          </aside>

          {/* Admin Main */}
          <div className="flex-1 flex flex-col lg:ml-64">
            <header className="w-full sticky top-0 z-50">
              {Header ? (
                <Header onMenuClick={() => sidebarRef.current?.toggleSidebar()} />
              ) : (
                <div>⚠️ Header is undefined</div>
              )}
            </header>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      );
    } catch (err) {
      console.error("❌ Admin branch failed:", err);
      return <div>Admin branch error — check console</div>;
    }
  }

  // --- Patient / Default Layout ---
  try {
    return (
      <div
        className="min-h-screen h-full bg-white w-full bg-cover bg-center bg-no-repeat relative flex flex-col"
        style={{ backgroundImage: "url('/curve-lines.png')" }}
      >
        {Navbar ? <Navbar /> : <div>⚠️ Navbar is undefined</div>}
        {children}
        {Footer ? <Footer /> : <div>⚠️ Footer is undefined</div>}
      </div>
    );
  } catch (err) {
    console.error("❌ Patient branch failed:", err);
    return <div>Patient branch error — check console</div>;
  }
};

export default FinalLayout;
