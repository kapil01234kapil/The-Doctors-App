"use client";
import { Stethoscope, Menu, X, Bell } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import hook to get current pathname
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";
import useGetCountUnreadNotifications from "@/hooks/notifications/useGetCountUnreadNotifications";

// Optional: if you want logout functionality from Redux
// import { logout } from '@/store/authSlice'

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useSelector((store) => store.auth);

  const { unreadNotificationsCount } = useSelector(
    (store) => store.notification
  );
  useGetCountUnreadNotifications(user, pathname);


  useEffect(() => {
    // Check if current pathname matches any of the navLinks
    const matchingLink = navLinks.find((link) => link.href === pathname);
    if (matchingLink) {
      setActiveLink(matchingLink.name);
    } else {
      setActiveLink(""); // No link should be active
    }
  }, [pathname]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState("HOME");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ALL DOCTORS", href: "/allDoctors" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    setIsMobileMenuOpen(false); // Close mobile menu when link is clicked
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    // dispatch(logout()) // If using redux logout
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(null));
        router.push("/");
        toast.success(res.data.message);
      } else {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  bg-white pb-3 shadow-lg ">
      {/* Desktop and Tablet Layout */}
      <div className="hidden md:flex justify-between px-14 items-center w-full">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex gap-2 mt-5 items-center cursor-pointer"
        >
          <Stethoscope className="text-[#4d91ff]" />
          <p className="font-bold text-[#4d91ff] text-lg">THE DOCTORS APP</p>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white border-6 mt-4 border-[#4d91ff] rounded-full  lg:w-2/3 xl:w-1/2 md:w-3/5 p-2 lg:pl-15 flex justify-between items-center">
          <div className="flex gap-2 lg:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleLinkClick(link.name)}
                className={`relative pb-1 text-sm lg:text-base transition-colors duration-200 hover:text-[#4d91ff] ${
                  activeLink === link.name ? "text-[#4d91ff]" : "text-gray-700"
                }`}
              >
                {link.name}
                {activeLink === link.name && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4d91ff] transition-all duration-300"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}

          {!user ? (
            <Button
              variant="outline"
              onClick={() => router.push("/register/patient")}
              className="bg-[#4d91ff] lg:h-12 rounded-full cursor-pointer text-white  text-sm lg:text-base px-4 lg:px-6"
            >
              Login / Register
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              {/* Notification Bell Icon */}
              <button
                onClick={() => router.push("/patient/notifications")}
                className="relative text-gray-700 cursor-pointer hover:text-[#4d91ff]"
              >
                <Bell size={20} />

                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-3 h-3 text-[10px] text-white bg-red-500 rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Avatar Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer p-4 text-white bg-[#4d91ff]">
                    <AvatarImage  src={user?.profilePhoto || "/default-avatar.png"} />
                    <AvatarFallback>
                      {user?.fullName ? user.fullName[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/profile")}
                      className="justify-start cursor-pointer"
                    >
                      Update Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/myAppointments")}
                      className="justify-start cursor-pointer"
                    >
                      My Appointments
                    </Button>

                     <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/refer-earn")}
                      className="justify-start cursor-pointer"
                    >
                      Refer & Earn
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/change-password")}
                      className="justify-start cursor-pointer"
                    >
                      Change Password
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/add-recovery-email")}
                      className="justify-start cursor-pointer"
                    >
                      Add A Recovery Email
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/feedback")}
                      className="justify-start cursor-pointer"
                    >
                      Feedback
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/contact-admin")}
                      className="justify-start cursor-pointer"
                    >
                      Contact Admin
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start cursor-pointer  text-red-500"
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex gap-2 pl-3 items-center">
            <Stethoscope className="text-[#4d91ff]" size={20} />
            <p className="font-bold text-[#4d91ff] text-base">DOCTORS.ONLINE</p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!user ? (
              <Button
                onClick={() => router.push("/register/patient")}
                className="bg-[#4d91ff] text-white rounded-xl text-xs px-3 py-1"
              >
                Login/Register
              </Button>
            ) : (
             <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer p-4 text-white bg-[#4d91ff]">
                    <AvatarImage src={user?.profilePhoto || "/default-avatar.png"} />
                    <AvatarFallback>
                      {user?.fullName ? user.fullName[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/profile")}
                      className="justify-start"
                    >
                      Update Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/myAppointments")}
                      className="justify-start"
                    >
                      My Appointments
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/refer-earn")}
                      className="justify-start"
                    >
                      Refer & Earn
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/change-password")}
                      className="justify-start"
                    >
                      Change Password
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/add-recovery-email")}
                      className="justify-start"
                    >
                      Add A Recovery Email
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/feedback")}
                      className="justify-start"
                    >
                      Feedback
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push("/patient/contact-admin")}
                      className="justify-start"
                    >
                      Contact Admin
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start text-red-500"
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-[#4d91ff] transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 bg-white rounded-2xl shadow-xl p-4 w-full">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleLinkClick(link.name)}
                  className={`relative pb-2 text-sm transition-colors duration-200 hover:text-[#4d91ff] ${
                    activeLink === link.name
                      ? "text-[#4d91ff]"
                      : "text-gray-700"
                  }`}
                >
                  {link.name}
                  {activeLink === link.name && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4d91ff] transition-all duration-300"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
