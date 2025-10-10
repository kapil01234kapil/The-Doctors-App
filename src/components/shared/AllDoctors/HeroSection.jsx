"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import DoctorProfileCard from "./DoctorCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import useGetAllDoctors from "@/hooks/patients/useGetAllDoctors";
import { useRouter } from "next/navigation";
import Banner from "./Banner";

const HeroSection = () => {
  const router = useRouter();
  useGetAllDoctors();

  const { user } = useSelector((store) => store.auth);
  const { allDoctors } = useSelector((store) => store.auth);

  const [specializationFilter, setSpecializationFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [displayedDoctors, setDisplayedDoctors] = useState(allDoctors);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);

    setTimeout(() => {
      const filtered = allDoctors.filter((doctor) => {
        const doctorSpecializations =
          doctor?.doctorsProfile?.specializations?.toLowerCase() || "";
        const doctorLocation =
          doctor?.doctorsProfile?.clinic?.[0]?.city?.toLowerCase() || "";

        const specializationMatch = specializationFilter
          ? doctorSpecializations.includes(specializationFilter.toLowerCase())
          : true;

        const locationMatch = locationFilter
          ? doctorLocation.includes(locationFilter.toLowerCase())
          : true;

        return specializationMatch && locationMatch;
      });

      setDisplayedDoctors(filtered);
      setLoading(false);
    }, 400);
  };

  return (
    <section className="w-full min-h-screen  bg-white">
      {/* ===== Hero Banner ===== */}
      <Banner />

      {/* ===== Search Bar (below banner, right aligned) ===== */}
      <div className="w-full flex justify-end mt-6">
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl w-full max-w-lg lg:max-w-2xl">
          {/* Input Field with Icon */}
          <div className="relative w-full flex-1">
            <Input
              type="text"
              placeholder="Search specialization..."
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="h-12 pl-4 pr-10 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <Search
              size={20}
              className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-blue-600 transition"
              onClick={handleSearch}
            />
          </div>

          {/* Location Select */}
          <div className="w-1/2  flex items-center h-20 md:w-1/4">
            <Select  className=""
              onValueChange={(val) =>
                setLocationFilter(val === "all" ? "" : val)
              }
            >
              <SelectTrigger className=" rounded-xl h-20 cursor-pointer border border-gray-200  focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all">
                <SelectValue placeholder="Location" value={locationFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="all">All</SelectItem>
                <SelectItem className="cursor-pointer" value="delhi">Delhi</SelectItem>
                <SelectItem className="cursor-pointer" value="mumbai">Mumbai</SelectItem>
                <SelectItem className="cursor-pointer" value="bangalore">Bangalore</SelectItem>
                <SelectItem className="cursor-pointer" value="hyderabad">Hyderabad</SelectItem>
                <SelectItem className="cursor-pointer" value="chennai">Chennai</SelectItem>
                <SelectItem className="cursor-pointer" value="kolkata">Kolkata</SelectItem>
                <SelectItem className="cursor-pointer" value="pune">Pune</SelectItem>
                <SelectItem className="cursor-pointer" value="ahmedabad">Ahmedabad</SelectItem>
                <SelectItem className="cursor-pointer" value="jaipur">Jaipur</SelectItem>
                <SelectItem className="cursor-pointer" value="lucknow">Lucknow</SelectItem>
                <SelectItem className="cursor-pointer" value="surat">Surat</SelectItem>
                <SelectItem className="cursor-pointer" value="kanpur">Kanpur</SelectItem>
                <SelectItem className="cursor-pointer" value="nagpur">Nagpur</SelectItem>
                <SelectItem className="cursor-pointer" value="indore">Indore</SelectItem>
                <SelectItem className="cursor-pointer" value="bhopal">Bhopal</SelectItem>
                <SelectItem className="cursor-pointer" value="patna">Patna</SelectItem>
                <SelectItem className="cursor-pointer" value="vadodara">Vadodara</SelectItem>
                <SelectItem className="cursor-pointer" value="ludhiana">Ludhiana</SelectItem>
                <SelectItem className="cursor-pointer" value="coimbatore">Coimbatore</SelectItem>
                <SelectItem className="cursor-pointer" value="visakhapatnam">Visakhapatnam</SelectItem>
                <SelectItem className="cursor-pointer" value="agra">Agra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ===== Doctors Grid ===== */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-10 pb-16 pt-10 gap-6 transition-all duration-500 ${
          loading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {displayedDoctors?.length > 0 ? (
          displayedDoctors.map((doctor, index) => (
            <DoctorProfileCard
              key={index}
              onClick={() => {
                if (user) {
                  router.push(`/patient/doctorProfile/${doctor?._id}`);
                } else {
                  router.push("/login/patient");
                }
              }}
              specialty={doctor?.doctorsProfile?.specializations}
              name={doctor?.fullName}
              photo={doctor?.profilePhoto}
              experience={doctor?.doctorsProfile?.experience}
              location={[
                doctor?.doctorsProfile?.clinic?.[0]?.clinicAddress,
                doctor?.doctorsProfile?.clinic?.[0]?.city,
              ]
                .filter(Boolean) // removes undefined or empty values
                .join(", ")}
              reviews={doctor?.reviews?.length || 0}
              rating={doctor?.overAllRating || 0}
              consulatationFees={doctor?.doctorsProfile?.consultationFees}
              clinicName={doctor?.doctorsProfile?.clinic?.[0]?.clinicName}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <p className="text-lg font-semibold text-blue-700">
              No doctors found for the selected filters
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Try adjusting your search by specialization or location.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
