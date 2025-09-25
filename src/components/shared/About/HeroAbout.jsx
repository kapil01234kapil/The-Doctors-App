import React from 'react'
import DoctorInfoCard from './DoctorInfoCard'
import TeamCard from './TeamCard'
import Image from 'next/image'

const HeroAbout = () => {
  return (
    <div className="w-full relative">
      <div className="flex flex-col justify-center p-5 items-center gap-5 relative z-10">
        <h1 className="font-bold text-xl text-[#1195FF]">About Us</h1>
        <h1 className="font-bold text-5xl">Get In Touch With Our Team </h1>
        <p className="text-xl text-center">
          We have team and know-how to help you scale 10x faster team and know-how to help you scale 10x faster
        </p>

        <div className="flex items-center gap-5">
          {/* Left Side */}
          <div className="flex flex-col mt-10 justify-center items-center gap-2 w-full max-w-md">
            <div className="flex-1 w-full h-64">
              <TeamCard />
            </div>
            <div className="flex-1 w-full h-64">
              <DoctorInfoCard />
            </div>
          </div>

          {/* Center Image */}
          <div>
            <Image src="/heroAbout.png" width={500} height={400} alt="heroAbout" />
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

      {/* 🔵 Blue Diagonal Band */}
      <div className="absolute  left-0 w-full h-10 bg-[#1195FF] "></div>
    </div>
  )
}

export default HeroAbout
