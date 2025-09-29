"use client"

import React from 'react'
import DoctorInfoCard from './DoctorInfoCard'
import TeamCard from './TeamCard'
import Image from 'next/image'


const HeroAbout = () => {
  
  return (
    <div className="w-full mt-5 relative bg-gradient-to-b from-blue-200 from-5% via-blue-100 via-30% to-blue-50 to-95%">
      <div className="flex flex-col justify-center p-5 items-center gap-5 relative z-10">
        <h1 className="font-bold text-xl text-[#1195FF]">About Us</h1>
        <h1 className="font-bold text-5xl text-center">Get In Touch With Our Team</h1>
        <p className="text-md  text-center max-w-2xl">
          We have team and know-how to help you scale 10x faster team and know-how to help you scale 10x faster
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-5">
          {/* Left Side */}
          <div className="flex flex-col mt-10 justify-center items-center gap-2 w-full max-w-md">
            <div className="flex-1 w-full max-w-sm h-40">
              <TeamCard />
            </div>
            <div className="flex-1 max-w-sm h-40">
              <DoctorInfoCard />
            </div>
          </div>

          {/* Center Image with fade overlay */}
          <div className="relative w-[300px] sm:w-[400px] lg:w-[500px]">
            <Image
              src="/heroAbout.png"
              width={500}
              height={400}
              alt="heroAbout"
              className="w-full h-auto object-contain lg:mt-6"
            />
            {/* Fade overlay for bottom 20% */}
            <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-b from-transparent to-blue-50 pointer-events-none" />
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-center items-start gap-3">
            <h1 className="font-bold text-xl">
              <span className="text-[#1195FF] px-1">01</span> Increased Professional Satisfaction
            </h1>
            <h1 className="font-bold text-xl">
              <span className="text-[#1195FF] px-1">02</span> Fulfilling the goal of helping patients
            </h1>
            <h1 className="font-bold text-xl">
              <span className="text-[#1195FF] px-1">03</span> Making clinical work easier
            </h1>
            <h1 className="font-bold text-xl">
              <span className="text-[#1195FF] px-1">04</span> Delivering more efficient services.
            </h1>
          </div>
        </div>
      </div>

      {/* 🔵 Blue Straight Band (no rotation now) */}
      <div className="absolute -bottom-7 left-0 w-full h-10 bg-[#4D91FF]" />

     
    </div>
    
  )
}

export default HeroAbout
