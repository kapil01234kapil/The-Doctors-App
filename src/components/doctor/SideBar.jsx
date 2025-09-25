"use client";

import {
  ChevronDown,
  ChevronUp,
  LayoutList,
  Calendar,
  ClipboardList,
  Clock,
  User,
  Lock,
  Mail,
  LogOut,
  MessageCircle,
  Phone,
  Stethoscope,
  BadgeIndianRupee,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SideBar = () => {
    const { user } = useSelector((store) => store.auth);

  const pathname = usePathname();
  const [selected, setSelected] = useState("Dashboard");
  const [openGeneral, setOpenGeneral] = useState(true);
  const [openMyInfo, setOpenMyInfo] = useState(true);
  const [openSupport, setOpenSupport] = useState(true);

  const [logoutDialog, setLogoutDialog] = useState(false);

  const menu = [
    {
      section: "General",
      open: openGeneral,
      toggle: () => setOpenGeneral(!openGeneral),
      items: [
        { name: "Dashboard", icon: <LayoutList size={16} />, path: "/doctor/dashboard" },
        { name: "Calendar", icon: <Calendar size={16} />, path: "/doctor/calendar" },
        { name: "Appointment", icon: <ClipboardList size={16} />, path: "/doctor/appointment" },
        { name: "Schedule", icon: <Clock size={16} />, path: "/doctor/schedule" },
        { name: "Finance", icon: <BadgeIndianRupee size={16} />, path: "/doctor/finance" },
      ],
    },
   {
    section: "My Info",
    open: openMyInfo,
    toggle: () => setOpenMyInfo(!openMyInfo),
    items: [
      ...(user?.doctorsProfile?.verifiedDoctor === false
        ? [{ name: "Complete Verification Status", icon: <ClipboardList size={16} />, path: "/doctor/verification" }]
        : []),
      { name: "Profile", icon: <User size={16} />, path: "/doctor/profile" },
      { name: "Change Password", icon: <Lock size={16} />, path: "/doctor/change-password" },
      { name: "Add Recovery Email", icon: <Mail size={16} />, path: "/doctor/add-recovery-email" },
      // conditionally add verification status here
      
      { name: "Logout", icon: <LogOut size={16} />, path: null },
    ],
  },
    {
      section: "Support",
      open: openSupport,
      toggle: () => setOpenSupport(!openSupport),
      items: [
        { name: "Feedback", icon: <MessageCircle size={16} />, path: "/doctor/feedback" },
        { name: "Contact Admin", icon: <Phone size={16} />, path: "/doctor/contact-admin" },
      ],
    },
  ];

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const activeItem = menu.flatMap((section) => section.items).find((item) => item.path === pathname);
    if (activeItem) {
      setSelected(activeItem.name);
    } else {
      setSelected("");
    }
  }, [pathname]);

  const logoutHandler = async () => {
    try {
      const res = await axios.post("/api/logout", {}, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setLogoutDialog(false);
    }
  };

  return (
    <>
      <div
        className="
          fixed md:static top-0 left-0 z-40 bg-[#4D91FF] flex flex-col gap-1
          pt-4 pl-4 pr-2 h-full min-h-screen transition-all
          w-20 sm:w-24 md:w-56 lg:w-64
        "
      >
        {/* Logo */}
        <div className="flex gap-1 sm:gap-2 items-center mb-4 whitespace-nowrap">
          <Stethoscope className="text-white" size={16} />
          <p className="font-bold text-white text-[8px] sm:text-sm md:text-base lg:text-base">
            DOCTORS.ONLINE
          </p>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 flex flex-col gap-4 text-white text-xs sm:text-sm md:text-sm overflow-x-auto overflow-y-auto scrollbar-hide">
          {menu.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div
                className="flex gap-1 sm:gap-2 items-center cursor-pointer select-none px-2 py-1"
                onClick={section.toggle}
              >
                <p className="font-semibold text-[10px] sm:text-sm md:text-base">{section.section}</p>
                {section.open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {section.open && (
                <div className="flex flex-col gap-1 pl-2 pb-2">
                  {section.items.map((item, i) =>
                    item.name === "Logout" ? (
                      <div
                        key={i}
                        onClick={() => setLogoutDialog(true)}
                        className={`flex gap-1 sm:gap-2 items-center cursor-pointer px-2 py-1 rounded transition-all
                          ${selected === item.name ? "bg-white text-[#1195FF]" : "hover:bg-blue-400 text-white"}`}
                      >
                        {item.icon}
                        <h1>{item.name}</h1>
                      </div>
                    ) : (
                      <Link
                        key={i}
                        href={item.path}
                        onClick={() => setSelected(item.name)}
                        className={`flex gap-1 sm:gap-2 items-center cursor-pointer px-2 py-1 rounded transition-all
                          ${selected === item.name ? "bg-white text-[#1195FF]" : "hover:bg-blue-400 text-white"}`}
                      >
                        {item.icon}
                        <h1>{item.name}</h1>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile Image stays at bottom-left */}
        <div className="pb-3 pt-1 flex items-center">
          <Avatar className="w-8 h-8">
            <AvatarFallback>CN</AvatarFallback>
            <AvatarImage src={user?.profilePhoto || "/defaultUserImage.jpg"} />
          </Avatar>
        </div>
      </div>

      {/* Logout Dialog */}
      <Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={logoutHandler}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideBar;
