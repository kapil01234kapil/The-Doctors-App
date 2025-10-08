"use client";

import React from "react";
import { Star, CheckCircle, MapPin, Clock, Calendar } from "lucide-react";
import Image from "next/image";

const DoctorProfileCard = ({
  name,
  photo,
  rating = 4.9,
  reviews ,
  specialty,
  experience,
  location,
  consulatationFees,
  clinicName,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#1195ff] cursor-pointer"
    >
      {/* Doctor Image + Top Badges */}
      <div className="relative">
        <div className="w-full h-52 overflow-hidden">
          <Image
            src={photo}
            alt={name}
            width={500}
            height={500}
            className="w-full h-full object-cover "
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 flex items-center shadow-sm">
          <Star className="h-4 w-4 text-[#ffd700] fill-[#ffd700]" />
          <span className="ml-1 text-sm font-bold text-[#292929]">
            {rating?.toFixed(1) || "4.9"}
          </span>
        </div>

        {/* Availability */}
        <div className="absolute bottom-3 left-3 bg-green-50 rounded-full px-2.5 py-1 flex items-center shadow-sm">
          <Clock className="h-3 w-3 text-green-600" />
          <span className="ml-1 text-xs font-medium text-green-600">
            Available 
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        {/* Name + Verified */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-[#292929]">{name}</h3>
          <div className="flex items-center text-[#1195ff]">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Verified</span>
          </div>
        </div>

        {/* Specialty + Reviews */}
        <div className="mb-3">
          <span className="bg-[#e6f1fb] text-[#1195ff] text-xs font-medium px-2.5 py-1 rounded-full inline-block">
            {specialty || "General"}
          </span>
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500">
              {reviews} patient reviews
            </span>
            <div className="w-1 h-1 bg-gray-400 rounded-full mx-2"></div>
            <span className="text-xs font-medium text-gray-700">
              {experience} yrs exp
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-xs mb-4">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-gray-400" />
          <span className="truncate">{location}</span>
        </div>

        {/* Fee + Next available */}
        <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">Consultation fee</span>
            <p className="text-sm font-bold text-[#292929]">₹{consulatationFees ? consulatationFees : "NA"}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Clinic Name</span>
            <p className="text-sm font-medium text-green-600">{clinicName || 'NA'}</p>
          </div>
        </div>

        {/* Book Button */}
        <button className="w-full cursor-pointer flex items-center justify-center gap-2 bg-[#4d91ff] text-white hover:bg-[#0d85e8] transition-colors duration-300 px-4 py-2.5 rounded-lg font-medium text-sm">
          <Calendar className="h-4 w-4" />
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorProfileCard;
