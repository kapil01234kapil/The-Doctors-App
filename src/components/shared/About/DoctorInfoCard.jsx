"use client";

import React from "react";

const DoctorInfoCard = () => {
  return (
    <div className="flex justify-center items-center p-2 mt-20">
      <div className="relative w-fit max-w-md">
        {/* Circular Avatar */}
        <div className="absolute -top-12 left-1/5 -translate-x-1/2 z-10">
          <div className="w-25 h-25 rounded-full overflow-hidden border-4 border-gray-300 shadow-3xl  bg-gray-100 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80"
              alt="Doctor"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Card (custom-made) */}
        <div className="pt-5 pb-6 px-4 sm:px-6 rounded-3xl shadow-lg bg-gray-50 border border-gray-200 text-center space-y-4">
          {/* Name */}
          <h2 className="text-md ml-15 sm:text-md md:text-sm  font-bold text-gray-900">
            Dr. Kamalesh Narayan
          </h2>
          {/* Description */}
          <p className="text-gray-600 italic text-sm sm:text-base md:text-md leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoCard;
