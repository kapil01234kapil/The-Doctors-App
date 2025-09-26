"use client";

import React from "react";
import { useSelector } from "react-redux";
import useGetAllDoctorsFinance from "@/hooks/admin/useGetAllDoctorsFinance";
import { Calendar } from "lucide-react";
import moment from "moment";

const Revenue = () => {
  useGetAllDoctorsFinance();
  const { allDoctorsFinances } = useSelector((store) => store.admin);

  if (!allDoctorsFinances || allDoctorsFinances.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No Finance Records Found
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#4d91ff] flex items-center gap-2">
        <Calendar size={24} /> Doctor Finance Dashboard
      </h1>

      {allDoctorsFinances.map((finance) => (
        <div
          key={finance._id}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6"
        >
          {/* Doctor Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  finance.appointments?.[0]?.doctor?.profilePhoto ||
                  "/default-doctor.png"
                }
                alt="Doctor"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#4d91ff]"
              />
              <div>
                <h2 className="text-xl font-bold">
                  {finance.appointments?.[0]?.doctor?.fullName ||
                    "Doctor Name"}
                </h2>
                <p className="text-sm text-gray-500">
                  {finance.appointments?.[0]?.doctor?.email}
                </p>
                <p className="text-sm text-gray-500">
                  {finance.appointments?.[0]?.doctor?.contactDetails}
                </p>
              </div>
            </div>

            {/* Week Info */}
            <div className="flex flex-col gap-1 text-right">
              <p className="text-sm text-gray-500">Week</p>
              <p className="font-semibold">
                {moment(finance.weekStart).format("DD MMM YYYY")} -{" "}
                {moment(finance.weekEnd).format("DD MMM YYYY")}
              </p>
            </div>
          </div>

          {/* Finance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#4d91ff] text-white rounded-lg p-4 flex flex-col">
              <p className="text-sm">Total Amount</p>
              <p className="text-2xl font-bold">₹ {finance.totalAmount}</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col">
              <p className="text-sm">Platform Fees</p>
              <p className="text-2xl font-bold">₹ {finance.platformFees}</p>
            </div>
            <div className="bg-green-500 text-white rounded-lg p-4 flex flex-col">
              <p className="text-sm">Payable Amount</p>
              <p className="text-2xl font-bold">₹ {finance.payableAmount}</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#4d91ff] text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Patient</th>
                  <th className="px-4 py-2 text-left text-sm">Date</th>
                  <th className="px-4 py-2 text-left text-sm">Slot</th>
                  <th className="px-4 py-2 text-left text-sm">Status</th>
                  <th className="px-4 py-2 text-left text-sm">Fees</th>
                </tr>
              </thead>
              <tbody>
                {finance.appointments?.map((appt) => (
                  <tr
                    key={appt._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-sm">
                      {appt.patientProfile?.name ||
                        appt.patient?.fullName ||
                        "N/A"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {moment(appt.appointmentDate).format("DD MMM YYYY")}
                    </td>
                    <td className="px-4 py-2 text-sm">{appt.bookedSlot}</td>
                    <td className="px-4 py-2 text-sm capitalize">
                      {appt.status}
                    </td>
                    <td className="px-4 py-2 text-sm">₹ {appt.consultationFees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status */}
          <div className="flex justify-end">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                finance.status === "cleared"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {finance.status.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Revenue;
