import React from 'react'
import Navbar from '../Navbar'
import Link from 'next/link'
import { Calendar, Search } from 'lucide-react'
import { Pacifico } from 'next/font/google'

 const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
})
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
         <div className="w-full max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center bg-white shadow-md rounded-full overflow-hidden border border-gray-200">
              {/* Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tell Your Doctor Something"
                  className="w-full pl-12 pr-4 py-3 text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Button */}
              <Link href="/allDoctors">
                <button className="bg-[#4D91FF] cursor-pointer hover:bg-blue-600 text-white text-sm sm:text-base font-medium px-5 sm:px-7 py-3 flex items-center gap-2 transition-colors duration-200 rounded-full">
                  Book Appointment
                  <Calendar className="w-5 h-5" />
                </button>
              </Link>
            </div>
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
              <p className={`${pacifico.className} text-gray-900 text-xl leading-tight text-center`}>
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
      <div className="bg-[#4D91FF] text-white py-3 lg:py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-18  px-4">
          <h2 className="text-lg lg:text-xl font-bold">OFFERS :</h2>
          <div className="flex flex-col sm:flex-row gap-7 w-full lg:w-auto">
            <button className="border-2 cursor-pointer border-white px-4 py-4 rounded-lg hover:bg-white hover:text-blue-500 transition-colors text-sm whitespace-nowrap">
              Earn On our Referral Program
            </button>
            <button className="border-2 cursor-pointer border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-500 transition-colors text-sm whitespace-nowrap">
              50% off on Manual Therapy
            </button>
            <button className="border-2 cursor-pointer border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-500 transition-colors text-sm whitespace-nowrap">
              50% off on Manual Therapy
            </button>
            <button className="border-2 cursor-pointer border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-500 transition-colors text-sm whitespace-nowrap">
              50% off on Manual Therapy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroDashboard