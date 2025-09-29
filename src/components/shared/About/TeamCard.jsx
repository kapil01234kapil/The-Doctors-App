"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Replace these URLs as needed
const avatarImages = [
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=256&q=80",
];
const avatarFallbacks = ["DR", "EX", "?", "DR", "EX"];

const TeamCard = () => (
  <div className="w-fit max-w-2xl bg-white rounded-2xl shadow-lg px-2 py-3 md:px-3 md:py-4 flex flex-col">
    <h2 className="text-md sm:text-lg font-bold text-center mb-3 mt-0">
      Our Someone To BE decided
    </h2>

    {/* Avatars area with edge intersection */}
    <div className="flex flex-row justify-center items-center relative">
      {avatarImages.map((src, idx) => (
        <div
          key={idx}
          className={`relative ${
            idx !== 0 ? "-ml-8 sm:-ml-10 md:-ml-12" : ""
          }`}
        >
          <Avatar className="w-16 h-16 md:w-20 md:h-18 lg:w-25 lg:h-22  border-4 border-white shadow-lg">
            <AvatarImage src={src} alt={`Member ${idx + 1}`} />
            <AvatarFallback>{avatarFallbacks[idx]}</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  </div>
);

export default TeamCard;