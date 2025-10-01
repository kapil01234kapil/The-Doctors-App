"use client"

import useGetReferralRecord from '@/hooks/Referral/useGetReferralRecord';
import React from 'react';
import { useSelector } from 'react-redux';

const ReferredDoctorsTable = () => {
  // Demo data - replace with Redux data later
  useGetReferralRecord();
  const {referDetails} = useSelector((store) => store.auth)
  const doctorsData = [
    {
      id: 1,
      name: "Dr. Rahul Sharma",
      specialty: "Cardiologist",
      dateReferred: "10 Jun 2023",
      bookings: { current: 25, total: 25 },
      status: "Completed",
      earnings: "₹100"
    },
    {
      id: 2,
      name: "Dr. Priya Patel",
      specialty: "Dermatologist",
      dateReferred: "15 Jul 2023",
      bookings: { current: 25, total: 25 },
      status: "Completed",
      earnings: "₹100"
    },
    {
      id: 3,
      name: "Dr. Amit Kumar",
      specialty: "Neurologist",
      dateReferred: "23 Aug 2023",
      bookings: { current: 25, total: 25 },
      status: "Completed",
      earnings: "₹100"
    },
    {
      id: 4,
      name: "Dr. Sneha Gupta",
      specialty: "Gynecologist",
      dateReferred: "05 Sep 2023",
      bookings: { current: 18, total: 25 },
      status: "In Progress",
      earnings: "Pending"
    },
    {
      id: 5,
      name: "Dr. Vivek Singh",
      specialty: "Pediatrician",
      dateReferred: "12 Oct 2023",
      bookings: { current: 7, total: 25 },
      status: "In Progress",
      earnings: "Pending"
    }
  ];

  const getProgressPercentage = (current, total) => {
    return (current / total) * 100;
  };

  const getProgressBarColor = (status) => {
    return status === "Completed" ? "bg-blue-500" : "bg-blue-500";
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status === "Completed") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Referred Doctors</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-200 border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Doctor</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date Referred</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bookings</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {referDetails?.referredUsers?.map((doctor) => (
              <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{doctor?.referredUser?.fullName || "Boy"}</div>
                    <div className="text-sm text-gray-500">{doctor?.referredUser?.doctorsProfile?.specializations || "Doctor"}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {doctor?.referredDate?.split("T")?.[0]}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(doctor.status)}`}
                          style={{ width: `${getProgressPercentage(doctor?.numberOfAppointment, 25)}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-max">
                      {doctor?.numberOfAppointment}/{25}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={getStatusBadge(doctor.status)}>
                    {doctor?.status || "Pending"}
                  </span>
                </td>
               <td className="py-4 px-4 text-sm font-medium text-gray-900">
  {doctor?.status === "Completed" ? 100 : 0}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferredDoctorsTable;