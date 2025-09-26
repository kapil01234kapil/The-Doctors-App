"use client";

import { BellIcon, UserIcon, SearchIcon, Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white  shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center w-1/3">
        {/* Mobile Hamburger */}
        <button
          className="mr-3 lg:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        {/* Search */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
          />
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <BellIcon className="text-gray-600" size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#4d91ff] flex items-center justify-center text-white mr-2">
            <UserIcon size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
