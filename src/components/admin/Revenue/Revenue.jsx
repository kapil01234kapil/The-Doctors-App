"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import useGetAllDoctorsFinance from "@/hooks/admin/useGetAllDoctorsFinance";
import { Calendar, Search, FileWarning } from "lucide-react";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";

const Revenue = () => {
  useGetAllDoctorsFinance();
  const { allDoctorsFinances } = useSelector((store) => store.admin);

  // 🔹 New states for filter + search
  const [filter, setFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");

  // 🔹 Compute filtered + searched data
  const filteredFinances = useMemo(() => {
    if (!allDoctorsFinances) return [];

    const now = moment();

    return allDoctorsFinances.filter((finance) => {
      const weekStart = moment(finance.weekStart);
      const weekEnd = moment(finance.weekEnd);

      let inFilter = true;

      // Date filter
      if (filter === "week") {
        inFilter = now.isBetween(weekStart, weekEnd, "day", "[]");
      } else if (filter === "month") {
        inFilter =
          weekStart.isSame(now, "month") || weekEnd.isSame(now, "month");
      } else if (filter === "year") {
        inFilter =
          weekStart.isSame(now, "year") || weekEnd.isSame(now, "year");
      }

      // Payment status filter
      let inPayment = true;
      if (paymentFilter === "pending") {
        inPayment = finance.status === "pending";
      } else if (paymentFilter === "cleared") {
        inPayment = finance.status === "cleared";
      }

      // Search by doctor name
      const doctorName =
        finance.appointments?.[0]?.doctor?.fullName?.toLowerCase() || "";
      const inSearch = doctorName.includes(search.toLowerCase());

      return inFilter && inPayment && inSearch;
    });
  }, [allDoctorsFinances, filter, paymentFilter, search]);

  // 🔹 Mark as Paid handler
  const markAsPaid = async (financeId) => {
    try {
      const res = await axios.get(`/api/admin/paymentDone?id=${financeId}`);
      if (res.data.success) {
        toast.success("Payment marked as cleared!");
      } else {
        toast.error(res.data.message || "Failed to mark as paid");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#4d91ff] flex items-center gap-2">
          <Calendar size={24} /> Doctor Finance Dashboard
        </h1>

        {/* Filters + Search */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border cursor-pointer rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Dates</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border cursor-pointer rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="cleared">Cleared</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-9 pr-3 py-2 text-sm w-56"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* If no finance records */}
      {(!filteredFinances || filteredFinances.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md border border-gray-200 text-center">
          <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded-full mb-4">
            <FileWarning size={32} className="text-[#4d91ff]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Finance Records Found
          </h2>
          <p className="text-gray-500 text-sm max-w-md">
            Try adjusting your filters or search terms to view other records.
          </p>
        </div>
      )}

      {/* Finance Cards */}
      {filteredFinances.length > 0 &&
        filteredFinances.map((finance) => {
          const weekEnd = moment(finance.weekEnd);
          const canMarkPaid =
            weekEnd.isBefore(moment(), "day") && finance.status === "pending";

          return (
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
                        <td className="px-4 py-2 text-sm">
                          ₹ {appt.consultationFees}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status / Mark as Paid */}
              <div className="flex justify-end">
                {canMarkPaid ? (
                  <button
                    onClick={() => markAsPaid(finance._id)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                  >
                    Mark as Paid
                  </button>
                ) : (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      finance.status === "cleared"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {finance.status === "cleared" ? "Paid" : finance.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Revenue;
