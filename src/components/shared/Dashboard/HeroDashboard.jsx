import React from 'react'
import Navbar from '../Navbar'
import Link from 'next/link'

const HeroDashboard = () => {
  return (
    <div>
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-16 relative gap-8 lg:gap-0">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left order-2 lg:order-1 z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Book Appointments
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#4D91FF] mb-4">
            Anytime Anywhere
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 max-w-md mx-auto lg:mx-0">
            Find, Book, and Consult Without Hassle
          </p>

          {/* Search and Book Section */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tell Your Doctor Something"
                className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Link href="/allDoctors">
              <button className="bg-[#4D91FF] hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center justify-center gap-2 transition-colors duration-200 mx-auto sm:mx-0">
                Book Appointment
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 relative order-1 lg:order-2 flex justify-center">
          {/* Doctor Image */}
          <div className="relative w-full max-w-sm lg:max-w-md h-80 lg:h-[500px]">
            <img
              src="/heroHomeDoctor.png"
              alt="Doctor with tablet"
              className="w-full h-full object-contain object-bottom"
            />

            {/* Welcome Bubble - only for large screens */}
            <div className="hidden lg:block absolute top-1/3 -left-28 rounded-2xl p-3 w-80">
              <p className="text-gray-900 text-xl font-bold italic leading-tight text-center">
                Welcome, I'm here to care for you on Doctor.Online
              </p>
            </div>

            {/* Faster Booking & Lower Fee Paid - hidden on screens smaller than lg */}
            <div className="hidden lg:block absolute top-40 right-4 bg-white rounded-xl p-3 shadow-xl">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                Faster Booking
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </h3>
              <p className="text-xs text-gray-600">+36% vs last 6 mnths</p>
            </div>

            <div className="hidden lg:block absolute bottom-12 right-4 bg-white rounded-xl p-3 shadow-xl">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                Lower Fee Paid
                <svg
                  className="w-3 h-3 text-[#4D91FF]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </h3>
              <p className="text-xs text-gray-600">-24% vs last 6 mnths</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add spacing before offers on small screens */}
      <div className="mt-6 lg:mt-0"></div>

      {/* Offers Section */}
      <div className="bg-[#4D91FF] text-white py-4 lg:py-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 px-4">
          <h2 className="text-lg lg:text-xl font-bold">Offers :</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button className="border-2 border-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-500 transition-colors text-sm whitespace-nowrap">
              Earn On our Referral Program
            </button>
            <button className="border-2 border-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-500 transition-colors text-sm whitespace-nowrap">
              50% off on Manual Therapy
            </button>
            <button className="border-2 border-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-500 transition-colors text-sm whitespace-nowrap">
              50% off on Manual Therapy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroDashboard
