"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import AppointmentCards from "./AppointmentCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { useSelector } from "react-redux";
import useGetAllDoctorsAppointments from "@/hooks/doctors/useGetAllDoctorsAppointments";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user } = useSelector((store) => store.auth);
  const router = useRouter();
  useGetAllDoctorsAppointments();
  const { allAppointments } = useSelector((store) => store.auth);

  const totalAppointments = allAppointments?.length || 0;

  const completedAppointments = allAppointments?.filter(a => a.status === "completed") || [];
  const pendingAppointments = allAppointments?.filter(a => a.status === "confirmed") || [];
  const cancelledAppointments = allAppointments?.filter(a => a.status === "cancelled") || [];

  return (
    <div className="w-full bg-white p-4 h-full flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6">
      
      {/* Left Side */}
      <div className="flex flex-col w-full xl:w-full h-full items-center gap-6 xl:gap-20">
        
        {/* Earnings Card */}
        <Card className="w-full sm:w-full md:w-full xl:w-120 h-60 px-5 flex justify-center rounded-sm">
          <div className="flex flex-col gap-5 px-2 w-full">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xl md:text-2xl">Earning</h1>
              <EllipsisVertical />
            </div>
            <h1 className="font-bold text-3xl md:text-5xl">
              {user?.doctorsProfile?.earning || 0} INR
            </h1>
            <p className="text-base md:text-lg font-semibold">Available</p>
          </div>
        </Card>

        {/* Patients Card */}
        <Card className="w-full sm:w-full md:w-full xl:w-100">
          <div className="flex px-2 justify-between items-center">
            <h1 className="font-bold">Patients</h1>
            <p
              className="cursor-pointer text-sm md:text-base"
              onClick={() => router.push("/doctor/appointment")}
            >
              See All
            </p>
          </div>

          {allAppointments?.map((appointment) => (
            <div key={appointment._id || appointment.createdAt} className="flex flex-col px-3 py-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarFallback>
                      {appointment.patientProfile.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                    <AvatarImage src={appointment?.patient?.profilePhoto || "/defaultUserImage.jpg"} />
                  </Avatar>
                  <h1 className="text-sm md:text-base">{appointment.patientProfile.name}</h1>
                </div>
                <p className="text-green-500 text-sm md:text-base">
                  +{appointment.consultationFees || 0}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Right Side */}
      <div className="w-full flex flex-col justify-center gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <AppointmentCards
            title="Total No Of Appointments"
            total={totalAppointments}
            value={totalAppointments}
            textColor="text-blue-500"
          />
          <AppointmentCards
            title="Appointment Served"
            total={totalAppointments}
            value={completedAppointments.length}
            textColor="text-green-500"
          />
          <AppointmentCards
            title="Appointment Pending"
            total={totalAppointments}
            value={pendingAppointments.length}
            textColor="text-orange-500"
          />
          <AppointmentCards
            title="Cancelled Appointment"
            total={totalAppointments}
            value={cancelledAppointments.length}
            textColor="text-red-500"
          />
        </div>

        {/* Schedule Card */}
        <Card className="w-full">
          <CardHeader className="flex justify-between items-center">
            <h1 className="text-base md:text-lg">Schedule Maker</h1>
            <EllipsisVertical />
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-col xl:flex-row justify-center gap-6 items-center">
            <div className="flex flex-col gap-4 justify-between items-center">
              <Link href="/doctor/schedule">
                <Button variant="outline">New Schedule</Button>
              </Link>
              <Link href="/doctor/calendar">
                <Button variant="outline">View Schedule</Button>
              </Link>
            </div>
            <Calendar className="w-full sm:w-full md:w-full xl:w-70" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
