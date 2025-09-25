"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useGetFinanceRecords from "@/hooks/doctors/useGetFinanceRecords";
import { useSelector } from "react-redux";

const FinancePage = () => {
  useGetFinanceRecords();
  const { doctorFinanceRecords } = useSelector((store) => store.auth);
  const [expandedWeek, setExpandedWeek] = useState(null);

  // --- Calculate summary ---
  const totalEarnings = doctorFinanceRecords?.reduce(
    (acc, r) => acc + (r.totalAmount || 0),
    0
  );
  const totalPlatformFees = doctorFinanceRecords?.reduce(
    (acc, r) => acc + (r.platformFees || 0),
    0
  );
  const totalPayable = doctorFinanceRecords?.reduce(
    (acc, r) => acc + (r.payableAmount || 0),
    0
  );
  const pendingAmount = doctorFinanceRecords
    ?.filter((r) => r.status === "pending")
    .reduce((acc, r) => acc + (r.payableAmount || 0), 0);
  const clearedAmount = totalPayable - pendingAmount;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* --- Summary Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#4d91ff] text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{totalEarnings || 0}
          </CardContent>
        </Card>
        <Card className="shadow rounded-2xl">
          <CardHeader>
            <CardTitle>Cleared</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            ₹{clearedAmount || 0}
          </CardContent>
        </Card>
        <Card className="shadow rounded-2xl">
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-yellow-600">
            ₹{pendingAmount || 0}
          </CardContent>
        </Card>
        <Card className="shadow rounded-2xl">
          <CardHeader>
            <CardTitle>Platform Fees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-500">
            ₹{totalPlatformFees || 0}
          </CardContent>
        </Card>
      </div>

      {/* --- Weekly Transactions --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Weekly Transactions</h2>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#4d91ff] text-white text-left">
                <th className="p-3">Week</th>
                <th className="p-3">Appointments</th>
                <th className="p-3">Gross</th>
                <th className="p-3">Platform Fee</th>
                <th className="p-3">Payable</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {doctorFinanceRecords?.map((record) => {
                const weekLabel = `${new Date(
                  record.weekStart
                ).toLocaleDateString()} - ${new Date(
                  record.weekEnd
                ).toLocaleDateString()}`;
                return (
                  <React.Fragment key={record._id}>
                    <tr
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedWeek(
                          expandedWeek === record._id ? null : record._id
                        )
                      }
                    >
                      <td className="p-3">{weekLabel}</td>
                      <td className="p-3">{record.appointments?.length}</td>
                      <td className="p-3">₹{record.totalAmount}</td>
                      <td className="p-3">₹{record.platformFees}</td>
                      <td className="p-3">₹{record.payableAmount}</td>
                      <td className="p-3">
                        <Badge
                          className={
                            record.status === "cleared"
                              ? "bg-green-500"
                              : "bg-yellow-500 text-black"
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                    </tr>

                    {/* Expanded Row for Appointments */}
                    {expandedWeek === record._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="p-4">
                          <h3 className="font-semibold mb-2">
                            Appointments for this week
                          </h3>
                          <div className="space-y-2">
                            {record.appointments?.map((appt) => (
                              <Card
                                key={appt._id}
                                className="p-3 shadow-sm rounded-lg"
                              >
                                <p className="font-semibold">
                                  {appt.patientProfile?.name} (
                                  {appt.patientProfile?.age},{" "}
                                  {appt.patientProfile?.gender})
                                </p>
                                <p>Date: {new Date(appt.appointmentDate).toLocaleString()}</p>
                                <p>Slot: {appt.bookedSlot}</p>
                                <p>Fees: ₹{appt.consultationFees}</p>
                                <p>Status: {appt.status}</p>
                                <p>Payment: {appt.paymentStatus}</p>
                              </Card>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {doctorFinanceRecords?.map((record) => {
            const weekLabel = `${new Date(
              record.weekStart
            ).toLocaleDateString()} - ${new Date(
              record.weekEnd
            ).toLocaleDateString()}`;
            return (
              <Card
                key={record._id}
                className="p-4 shadow-lg rounded-2xl"
                onClick={() =>
                  setExpandedWeek(expandedWeek === record._id ? null : record._id)
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{weekLabel}</span>
                  <Badge
                    className={
                      record.status === "cleared"
                        ? "bg-green-500"
                        : "bg-yellow-500 text-black"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
                <p>Appointments: {record.appointments?.length}</p>
                <p>Gross: ₹{record.totalAmount}</p>
                <p>Platform Fee: ₹{record.platformFees}</p>
                <p className="font-semibold">Payable: ₹{record.payableAmount}</p>

                {/* Expanded Appointments */}
                {expandedWeek === record._id && (
                  <div className="mt-3 space-y-2">
                    <h3 className="font-semibold">Appointments</h3>
                    {record.appointments?.map((appt) => (
                      <Card
                        key={appt._id}
                        className="p-3 shadow-sm rounded-lg"
                      >
                        <p className="font-semibold">
                          {appt.patientProfile?.name} (
                          {appt.patientProfile?.age},{" "}
                          {appt.patientProfile?.gender})
                        </p>
                        <p>Date: {new Date(appt.appointmentDate).toLocaleString()}</p>
                        <p>Slot: {appt.bookedSlot}</p>
                        <p>Fees: ₹{appt.consultationFees}</p>
                        <p>Status: {appt.status}</p>
                        <p>Payment: {appt.paymentStatus}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
