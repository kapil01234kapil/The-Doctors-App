"use client"

import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import HomeShortCard from '../Dashboard/HomeShortCard'
import {
  Stethoscope,
  Baby,
  HeartPulse,
  Brain,
  Bone,
  Syringe,
  UserCircle,
  Sun,
} from "lucide-react";

const OurServicesAbout = () => {
     const medicalProfessions = [
    {
      title: "General Physician",
      description:
        "Provides primary care, diagnoses common illnesses, manages chronic conditions, and guides preventive healthcare for all patients.",
      icon: Stethoscope,
      color: "text-black",
    },
    {
      title: "Gynecologist",
      description:
        "Specializes in women's reproductive health, pregnancy, childbirth, and menstrual concerns, ensuring overall female wellness.",
      icon: Baby,
      color: "text-pink-500",
    },
    {
      title: "Dermatologist",
      description:
        "Treats skin, hair, and nail conditions, offers cosmetic care, and detects skin cancers at early stages.",
      icon: Sun,
      color: "text-yellow-500",
    },
    {
      title: "Neurologist",
      description:
        "Focuses on brain, nerves, and spinal cord disorders like epilepsy, migraines, strokes, and Parkinson's disease.",
      icon: Brain,
      color: "text-purple-500",
    },
    {
      title: "Cardiologist",
      description:
        "Specializes in heart health, treating hypertension, heart attacks, arrhythmias, and guiding lifestyle changes for prevention.",
      icon: HeartPulse,
      color: "text-red-500",
    },
    {
      title: "Orthopedic Surgeon",
      description:
        "Expert in bones, joints, and muscles, treating fractures, arthritis, and sports injuries to restore mobility.",
      icon: Bone,
      color: "text-green-500",
    },
    {
      title: "Pediatrician",
      description:
        "Provides medical care for infants, children, and teens, ensuring healthy growth, development, and preventive vaccinations.",
      icon: Syringe,
      color: "text-indigo-500",
    },
    {
      title: "Psychiatrist",
      description:
        "Treats mental health disorders such as depression, anxiety, and schizophrenia using therapy and medications.",
      icon: UserCircle,
      color: "text-teal-500",
    },
  ];
  return (
    <div className='w-full pb-20 '>
         <div className="w-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-10">
                <p className="text-blue-500">Our Services</p>
                <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mt-2">
                  WHAT ARE WE OFFERING
                </h1>
        
                {/* Carousel Section */}
                <div className="w-full mt-16 max-w-7xl px-2 sm:px-6 lg:px-12">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {medicalProfessions.map((item, idx) => (
                        <CarouselItem
                          key={idx}
                          className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                        >
                          <div className="  p-4 h-full">
                            <HomeShortCard
                              Icon={item.icon}
                              title={item.title}
                              desc={item.description}
                              color={item.color}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
        
                    {/* Custom styled navigation buttons */}
                    <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 shadow-lg hover:bg-[#1195FF] hover:text-white hover:border-[#1195FF] transition-all duration-300 hover:scale-110 hidden sm:flex" />
                    <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 shadow-lg hover:bg-[#1195FF] hover:text-white hover:border-[#1195FF] transition-all duration-300 hover:scale-110 hidden sm:flex" />
                  </Carousel>
                </div>
              </div>
    </div>
  )
}

export default OurServicesAbout