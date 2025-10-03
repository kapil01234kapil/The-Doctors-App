"use client";

import { Bell, ChevronDown, Sun, Menu } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useGetCountUnreadNotifications from "@/hooks/notifications/useGetCountUnreadNotifications";

const DoctorNavabr = ({ onMenuClick }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const router = useRouter();

  // 🔹 Fetch unread notifications
  useGetCountUnreadNotifications(user, pathname);
  const { unreadNotificationsCount } = useSelector(
    (store) => store.notification
  );

  console.log("Unread Notifications Count:", unreadNotificationsCount);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-16 bg-white shadow-md flex items-center px-4 sm:px-6 justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger Menu - Only visible on mobile/tablet */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-sm sm:text-base font-medium">Good Morning</h1>
        <Sun className="text-orange-400 w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Icon with Badge */}
        <div
          onClick={() => router.push("/doctor/notifications")}
          className="relative rounded-full bg-gray-50 w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
            </span>
          )}
        </div>

        {/* Profile + Popover */}
        <Avatar className="w-8 h-8">
          <AvatarFallback>CN</AvatarFallback>
          <AvatarImage src={user?.profilePhoto} />
        </Avatar>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <h1 className="text-sm sm:text-base">{user?.fullName}</h1>

              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-40 p-2 bg-white shadow-lg rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/doctor/profile")}
                className="w-full cursor-pointer text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push("/doctor/refer-earn")}
                className="w-full cursor-pointer text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
              >
                REFER & EARN
              </button>
              <button
                onClick={logoutHandler}
                className="w-full text-left px-3 py-2  cursor-pointer rounded-md hover:bg-gray-100 text-sm text-red-500"
              >
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DoctorNavabr;
