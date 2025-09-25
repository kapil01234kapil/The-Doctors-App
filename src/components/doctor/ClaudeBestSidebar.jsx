"use client"
import { useState } from "react";

// Mock icons for demonstration
const ChevronDown = () => <span>▼</span>;
const ChevronUp = () => <span>▲</span>;
const LayoutList = () => <span>📊</span>;
const Calendar = () => <span>📅</span>;
const ClipboardList = () => <span>📋</span>;
const Clock = () => <span>⏰</span>;
const User = () => <span>👤</span>;
const Lock = () => <span>🔒</span>;
const Mail = () => <span>✉️</span>;
const LogOut = () => <span>🚪</span>;
const Users = () => <span>👥</span>;
const MessageCircle = () => <span>💬</span>;
const Phone = () => <span>📞</span>;
const Stethoscope = () => <span>🩺</span>;
const Menu = () => <span>☰</span>;
const X = () => <span>✕</span>;

const SideBar = () => {
  const [selected, setSelected] = useState("Dashboard");
  const [openGeneral, setOpenGeneral] = useState(true);
  const [openMyInfo, setOpenMyInfo] = useState(true);
  const [openSupport, setOpenSupport] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (name) => {
    setSelected(name);
    setIsOpen(false);
  };

  const menu = [
    {
      section: "General",
      open: openGeneral,
      toggle: () => setOpenGeneral(!openGeneral),
      items: [
        { name: "Dashboard", icon: <LayoutList /> },
        { name: "Calendar", icon: <Calendar /> },
        { name: "Appointment", icon: <ClipboardList /> },
        { name: "Schedule", icon: <Clock /> },
      ],
    },
    {
      section: "My Info",
      open: openMyInfo,
      toggle: () => setOpenMyInfo(!openMyInfo),
      items: [
        { name: "Profile", icon: <User /> },
        { name: "Change Password", icon: <Lock /> },
        { name: "Add Recovery Email", icon: <Mail /> },
        { name: "Log out", icon: <LogOut /> },
      ],
    },
    {
      section: "Support",
      open: openSupport,
      toggle: () => setOpenSupport(!openSupport),
      items: [
        { name: "About Us", icon: <Users /> },
        { name: "Feedback", icon: <MessageCircle /> },
        { name: "Contact Admin", icon: <Phone /> },
      ],
    },
  ];

  return (
    <>
      {/* Mobile/Tablet Header Bar */}
      <div className="lg:hidden flex items-center justify-between bg-blue-500 p-4 relative z-40">
        <div className="flex items-center gap-2">
          <Stethoscope />
          <span className="text-white font-bold text-sm sm:inline hidden">
            DOCTORS.ONLINE
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-white p-1 hover:bg-blue-600 rounded transition-colors"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-blue-500 flex flex-col gap-1 pt-4 pl-5 min-h-screen
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:relative lg:w-1/6 lg:z-auto
          fixed top-0 left-0 w-80 sm:w-72 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Desktop Logo */}
        <div className="hidden lg:flex gap-2 items-center mb-4">
          <Stethoscope />
          <p className="font-bold text-white text-sm">DOCTORS.ONLINE</p>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden flex gap-2 items-center mb-4 pr-5">
          <Stethoscope />
          <p className="font-bold text-white text-sm">DOCTORS.ONLINE</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="ml-auto text-white p-1 hover:bg-blue-600 rounded"
          >
            <X />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="flex flex-col gap-4 text-white text-sm overflow-y-auto flex-1 pr-2">
          {menu.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <div
                className="flex gap-2 items-center cursor-pointer select-none hover:bg-blue-600 p-2 rounded-l transition-colors"
                onClick={section.toggle}
              >
                <p className="font-semibold text-lg">{section.section}</p>
                {section.open ? <ChevronUp /> : <ChevronDown />}
              </div>

              {section.open && (
                <div className="flex flex-col gap-2 pl-2 pb-4 border-b border-white border-opacity-30">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleItemClick(item.name)}
                      className={`flex gap-3 items-center cursor-pointer px-3 py-2 rounded-l-lg transition-all duration-200 text-base
                        ${selected === item.name
                          ? "bg-white text-blue-500"
                          : "text-white hover:bg-blue-400"
                        }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile */}
        <div className="mt-auto pb-5 pt-4 pr-5 border-t border-white border-opacity-20">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/36"
              alt="Profile"
              className="rounded-full w-9 h-9 border-2 border-white"
            />
            <div className="hidden sm:block lg:hidden xl:block">
              <p className="text-white text-xs font-medium">Dr. John Doe</p>
              <p className="text-blue-200 text-xs">Online</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;