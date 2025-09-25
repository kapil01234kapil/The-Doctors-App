"use client";
import React from "react";
import HomeShortCard from "./HomeShortCard";
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

// Import shadcn/ui Carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DashboardCard from "./DashboardCard";
import { useSelector } from "react-redux";

const DashboardSecond = () => {
  const {allDoctors} = useSelector((store) => store.auth)
  const medicalProfessions = [
    {
      title: "General Physician",
      description:
        "Provides primary care, diagnoses common illnesses, manages chronic conditions, and guides preventive healthcare for all patients.",
      icon: Stethoscope,
    },
    {
      title: "Gynecologist",
      description:
        "Specializes in women's reproductive health, pregnancy, childbirth, and menstrual concerns, ensuring overall female wellness.",
      icon: Baby,
    },
    {
      title: "Dermatologist",
      description:
        "Treats skin, hair, and nail conditions, offers cosmetic care, and detects skin cancers at early stages.",
      icon: Sun,
    },
    {
      title: "Neurologist",
      description:
        "Focuses on brain, nerves, and spinal cord disorders like epilepsy, migraines, strokes, and Parkinson's disease.",
      icon: Brain,
    },
    {
      title: "Cardiologist",
      description:
        "Specializes in heart health, treating hypertension, heart attacks, arrhythmias, and guiding lifestyle changes for prevention.",
      icon: HeartPulse,
    },
    {
      title: "Orthopedic Surgeon",
      description:
        "Expert in bones, joints, and muscles, treating fractures, arthritis, and sports injuries to restore mobility.",
      icon: Bone,
    },
    {
      title: "Pediatrician",
      description:
        "Provides medical care for infants, children, and teens, ensuring healthy growth, development, and preventive vaccinations.",
      icon: Syringe,
    },
    {
      title: "Psychiatrist",
      description:
        "Treats mental health disorders such as depression, anxiety, and schizophrenia using therapy and medications.",
      icon: UserCircle,
    },
  ];

  return (
    <div className="mt-20 w-full">
      {/* Our Services Section */}
      <div className="w-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-10">
        <p className="text-blue-500">Our Services</p>
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mt-2">
          WHAT ARE WE OFFERING
        </h1>

        {/* Carousel Section */}
        <div className="w-full mt-16 max-w-7xl px-12">
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
                  <HomeShortCard
                    Icon={item.icon}
                    title={item.title}
                    desc={item.description}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom styled navigation buttons */}
            <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 shadow-lg hover:bg-[#1195FF] hover:text-white hover:border-[#1195FF] transition-all duration-300 hover:scale-110 hidden sm:flex" />
            <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 shadow-lg hover:bg-[#1195FF] hover:text-white hover:border-[#1195FF] transition-all duration-300 hover:scale-110 hidden sm:flex" />
          </Carousel>
        </div>
      </div>

      {/* Our Doctors Section */}
      <div className="w-full mt-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-10">
        <p className="text-blue-500">Our Doctors</p>
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mt-2">
          TOP DOCTORS TO BOOK
        </h1>

        <div className="w-full mt-16 max-w-7xl px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {allDoctors.map((doctor) => (
                <CarouselItem 
                  key={doctor?._id} 
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                >
                  <DashboardCard
                    name={doctor?.fullName}
                    image={doctor?.profilePhoto}
                    
                  />
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
  );
};

export default DashboardSecond;