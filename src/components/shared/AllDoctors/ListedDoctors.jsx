"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import DoctorProfileCard from "./DoctorCard";
import MedicalSearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import useGetAllDoctors from "@/hooks/patients/useGetAllDoctors";
import { useRouter } from "next/navigation";



const DoctorsListPage = () => {
  const router = useRouter();
  useGetAllDoctors();
  const { user } = useSelector((store) => store.auth);
  const { allDoctors } = useSelector((store) => store.auth);
  return (
    <div className="w-full  min-h-screen  px-6 py-10">
      {/* Search bar */}

      {/* Doctors grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4   gap-6">
        {allDoctors.map((doctor, index) => (
          <DoctorProfileCard
            onClick={() => {
              if (user) {
                router.push(`/patient/doctorProfile/${doctor?._id}`);
              } else {
                router.push("/patient/login");
              }
            }}
            specialty={doctor?.doctorsProfile?.specializations}
            name={doctor?.fullName}
            photo={doctor?.profilePhoto}
            experience={doctor?.doctorsProfile?.experience}
            location={doctor?.doctorsProfile?.clinic?.[0].city}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsListPage;
