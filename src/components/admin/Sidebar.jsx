"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import {
  LayoutDashboard,
  CalendarClock,
  UserRound,
  Users,
  BadgeCheck,
  Ban,
  MessageSquare,
  HelpCircle,
  DollarSign,
  Share2,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

const Sidebar = forwardRef((props, ref) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // expose toggleSidebar() to parent (Header / FinalLayout)
  useImperativeHandle(ref, () => ({
    toggleSidebar: () => setIsOpen((prev) => !prev),
    closeSidebar: () => setIsOpen(false),
  }));

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "appointments", label: "Appointments", icon: <CalendarClock size={20} /> },
    { id: "doctors", label: "Doctors", icon: <UserRound size={20} /> },
    { id: "patients", label: "Patients", icon: <Users size={20} /> },
    { id: "doctor-verification", label: "Doctor Verification", icon: <BadgeCheck size={20} /> },
    { id: "blockedUser", label: "Blocked Users", icon: <Ban size={20} /> },
    { id: "feedback", label: "Feedback", icon: <MessageSquare size={20} /> },
    { id: "queries", label: "Queries", icon: <HelpCircle size={20} /> },
    { id: "revenue", label: "Revenue", icon: <DollarSign size={20} /> },
    { id: "referrals", label: "Referrals", icon: <Share2 size={20} /> },
  ];

  const handleNavigation = (id) => {
    router.push(`/admin/${id}`);
    setIsOpen(false); // close sidebar on mobile
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logout", {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
        router.push("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-md flex flex-col justify-between
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        h-screen
      `}
    >
      <div>
        {/* Logo for large screens */}
        <div className="hidden lg:block p-4 bg-[#4d91ff] text-white">
          <h1 className="text-xl font-bold">Doctors-Online</h1>
          <p className="text-sm">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => {
              const isActive = pathname === `/admin/${item.id}`;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`flex cursor-pointer items-center w-full px-4 py-3 text-left ${
                      isActive
                        ? "bg-blue-50 text-[#4d91ff] border-r-4 border-[#4d91ff]"
                        : "text-gray-600 hover:bg-blue-50 hover:text-[#4d91ff]"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mb-4 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer w-full px-4 py-3 text-left text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
