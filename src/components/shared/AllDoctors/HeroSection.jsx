"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import DoctorProfileCard from "./DoctorCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector } from "react-redux";
import useGetAllDoctors from "@/hooks/patients/useGetAllDoctors";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();
  useGetAllDoctors();
  const { user } = useSelector((store) => store.auth);
  console.log("User from store:", user);
  const { allDoctors } = useSelector((store) => store.auth);

  // Filters state
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Filtered doctors based on inputs
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doctor) => {
      const doctorSpecializations = doctor?.doctorsProfile?.specializations?.toLowerCase() || "";
      const doctorLocation = doctor?.doctorsProfile?.clinic?.[0]?.city?.toLowerCase() || "";

      const specializationMatch = specializationFilter
        ? doctorSpecializations.includes(specializationFilter.toLowerCase())
        : true;

      const locationMatch = locationFilter
        ? doctorLocation.includes(locationFilter.toLowerCase())
        : true;

      return specializationMatch && locationMatch;
    });
  }, [allDoctors, specializationFilter, locationFilter]);

  return (
    <section className="w-full min-h-screen mt-3 bg-white  md: lg:">
      {/* Hero Section */}
     <div className="relative w-full">
  <Image
    src="/allDoctorsMain.png"
    alt="Doctor with tablet"
    className="w-full h-[500px] md:h-[600px] lg:h-[700px] object-cover"
    height={700}
    width={1920}
  />

  {/* Fade overlay only on bottom 30% */}
  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent to-white pointer-events-none" />

  {/* Text Content */}
  <div className="absolute inset-0 w-11/12 md:w-1/2 text-black flex flex-col justify-start pt-28 items-center md:items-start px-4 md:px-12 lg:px-20  gap-18 text-center md:text-left">
    <h1 className="font-bold text-3xl lg:text-6xl leading-snug text-black drop-shadow-lg">
      Top Verified <span className="text-[#4d91ff]">Doctors</span> Near You
    </h1>
    <div className="flex flex-col ">
  <p className="text-black text-base md:text-lg drop-shadow-md">
      Search By Name, Speciality or Location – it’s quick and easy
    </p>

     <p className="text-black text-base md:text-lg drop-shadow-md">
      Search By Name, Speciality or Location – it’s quick and easy
    </p>
    </div>
  
  </div>

  {/* Filter Section */}
  <div className="w-full flex justify-start mt-6 lg:absolute lg:bottom-28 pl-18">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-11/12 max-w-6xl bg-blue-50 p-4 rounded-3xl shadow-lg relative lg:-translate-y-1/4">
      {/* Specialization Input */}
      <div className="w-full lg:w-1/2 relative mb-3 lg:mb-0">
        <Input
          type="text"
          placeholder="Specialization"
          value={specializationFilter}
          onChange={(e) => setSpecializationFilter(e.target.value)}
          className="pl-10 h-12 bg-white rounded-full w-full"
        />
        <Search className="absolute left-3 top-4 text-gray-400" size={18} />
      </div>

      {/* Location Select */}
      <div className="w-full lg:w-1/4 relative mb-3 lg:mb-0">
        <Select
          onValueChange={(val) => setLocationFilter(val === "all" ? "" : val)}
        >
          <SelectTrigger className="pl-10 h-12 bg-white rounded-full w-full">
            <SelectValue placeholder="Location" value={locationFilter} />
          </SelectTrigger>
          <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="hyderabad">Hyderabad</SelectItem>
            <SelectItem value="chennai">Chennai</SelectItem>
            <SelectItem value="kolkata">Kolkata</SelectItem>
            <SelectItem value="pune">Pune</SelectItem>
            <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
            <SelectItem value="jaipur">Jaipur</SelectItem>
            <SelectItem value="lucknow">Lucknow</SelectItem>
            <SelectItem value="surat">Surat</SelectItem>
            <SelectItem value="kanpur">Kanpur</SelectItem>
            <SelectItem value="nagpur">Nagpur</SelectItem>
            <SelectItem value="indore">Indore</SelectItem>
            <SelectItem value="bhopal">Bhopal</SelectItem>
            <SelectItem value="patna">Patna</SelectItem>
            <SelectItem value="vadodara">Vadodara</SelectItem>
            <SelectItem value="ludhiana">Ludhiana</SelectItem>
            <SelectItem value="coimbatore">Coimbatore</SelectItem>
            <SelectItem value="visakhapatnam">Visakhapatnam</SelectItem>
            <SelectItem value="agra">Agra</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <div className="w-full lg:w-1/4">
        <Button
          className="bg-[#4d91ff] hover:bg-[#0d7dd1] h-12 text-lg cursor-pointer text-white w-full rounded-full"
          onClick={() => {}}
        >
          Search
        </Button>
      </div>
    </div>
  </div>
</div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-15 bg-white gap-6 pt-7">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, index) => (
            <DoctorProfileCard
              key={index}
              onClick={() => {
                if (user) {
                  console.log("user is there")
                  router.push(`/patient/doctorProfile/${doctor?._id}`);
                } else {
                  console.log("user is not there")
                  router.push("/login/patient");
                }
              }}
              specialty={doctor?.doctorsProfile?.specializations}
              name={doctor?.fullName}
              photo={doctor?.profilePhoto}
              experience={doctor?.doctorsProfile?.experience}
              location={doctor?.doctorsProfile?.clinic?.[0]?.city}
            />
          ))
        ) : (
          <p className="text-center col-span-full mt-10 text-gray-500">
            No doctors found for the selected filters.
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
