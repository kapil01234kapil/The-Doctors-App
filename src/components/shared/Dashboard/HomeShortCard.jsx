"use client";
import { useState } from "react";

export default function HomeShortCard({ Icon, title, desc }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex justify-center">
      <div
        onClick={() => setActive(!active)}
        className={`relative w-64 sm:w-72 md:w-80 lg:w-96 min-h-60 rounded-xl mt-10 shadow-md p-6 text-center cursor-pointer transition-all duration-300 ${
          active ? "bg-[#1195FF] text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Circle Icon */}
        <div className="absolute   -top-10 left-1/2 transform -translate-x-1/2">
          <div
            className={`w-20 h-20 bg-white  rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
              active ? "bg-white" : "bg-[#1195FF]/10"
            }`}
          >
            <Icon
              size={36}
              className={active ? "text-[#1195FF]" : "text-[#1195FF]"}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-12">
          <h3
            className={`text-lg font-bold tracking-wide transition-all duration-300 ${
              active ? "text-white" : "text-[#1195FF]"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm mt-2 leading-relaxed transition-all duration-300 ${
              active ? "text-white" : "text-gray-600"
            }`}
          >
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
