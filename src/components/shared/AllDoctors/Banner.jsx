"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl overflow-hidden relative">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />

      {/* Content Wrapper */}
      <div className="flex flex-col md:flex-row items-center justify-between relative z-10 sm:p-0 md:px-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-white p-5 mb-8 md:mb-0">
          <h2 className="text-3xl sm:text-3xl lg:text-6xl font-bold mb-4">
            Your Health Is Our Priority
          </h2>
          <p className="text-base sm:text-lg lg:text-2xl opacity-90 mb-6">
            Experience world-class healthcare services with our team of dedicated
            professionals.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer transition-colors px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center text-sm sm:text-base">
              Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <button className="bg-transparent border-2 border-white text-white cursor-pointer hover:bg-white/10 transition-colors px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-90 h-75 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-140 lg:h-112">
            <Image
              src="/allDoctorsMain.png"
              alt="Healthcare professionals team"
              fill
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-blue-800/30 backdrop-blur-sm px-6 sm:px-8 py-4 flex flex-wrap justify-center md:justify-between items-center gap-4">
        {/* Trusted by 10,000+ patients (always visible) */}
        <div className="text-white text-sm sm:text-md flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Trusted by 10,000+ patients
        </div>

        {/* Board-certified specialists (hidden on mobile) */}
        <div className="hidden sm:flex text-white text-sm sm:text-md items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Board-certified specialists
        </div>

        {/* 24/7 emergency care (hidden on mobile) */}
        <div className="hidden sm:flex text-white text-sm sm:text-md items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          24/7 emergency care
        </div>
      </div>
    </section>
  );
};

export default Banner;
