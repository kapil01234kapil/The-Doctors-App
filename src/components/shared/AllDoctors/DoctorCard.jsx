"use client"

import React from 'react';
import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';

const DoctorProfileCard = ({
  name,
  photo,
  rating,
  reviews,
  specialty,
  experience,
  location,
  onClick
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100" onClick={onClick}>
      {/* Doctor Image */}
      <div className="relative">
        <div className="h-64 sm:h-72 md:h-80 bg-gradient-to-br border-2 rounded-4xl border-blue-400 from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
          <Image 
            src={photo} 
            alt={name}
            width={500}
            height={500}
            className="w-full h-full object-fill object-center"
          />
        </div>
        {/* Blue gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-400/20 to-transparent"></div>
      </div>
      
      {/* Doctor Information */}
      <div className="px-6 py-6">
        {/* Name */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3">
          {name}
        </h2>
        
        {/* Rating and Reviews */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-semibold text-gray-900">{rating}</span>
          </div>
          <span className="text-gray-600 text-sm sm:text-base">
            {reviews} reviews
          </span>
        </div>
        
        {/* Specialty and Experience */}
        <div className="text-center mb-4">
          <p className="text-gray-900 font-medium text-base sm:text-lg">
            <span className="text-gray-700">{specialty}, </span>
            <span className="text-gray-600">{experience} yrs</span>
          </p>
        </div>
        
        {/* Location */}
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm sm:text-base">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileCard;
