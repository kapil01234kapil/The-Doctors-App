"use client";

import { Card } from "@/components/ui/card";
import useGetCountUnreadNotifications from "@/hooks/notifications/useGetCountUnreadNotifications";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const DashboardCard = ({ image, name }) => {
  const router = useRouter();
  const { user } = useSelector((store) => store.auth);
  
  const checkAvailability = () => {
    if (!user || user === null) {
      router.push("/patient/login");
    } else {
      router.push("/allDoctors");
    }
  };
  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="flex flex-col items-center justify-center p-4 sm:p-6 shadow-lg bg-white rounded-2xl transition hover:shadow-xl">
        {/* Image */}
        <Image
          width={500}
          height={500}
          src={image}
          alt="Doctor"
          className="w-full h-48 sm:h-56 md:h-64  object-fill rounded-lg"
        />

        {/* Content */}
        <div className="flex flex-col items-center justify-center mt-4 gap-2">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            {name}
          </h1>
          <p
            onClick={checkAvailability}
            className="text-sm sm:text-base text-blue-600 underline cursor-pointer hover:text-blue-800"
          >
            Check Availability
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardCard;
