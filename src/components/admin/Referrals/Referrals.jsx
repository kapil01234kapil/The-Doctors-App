"use client";

import React, { useState } from "react";
import useGetAllReferalRecords from "@/hooks/admin/useGetAllReferalRecords";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, User, Calendar, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const Referrals = () => {
  useGetAllReferalRecords();
  const { referalRecord } = useSelector((store) => store.admin);
  const [loadingId, setLoadingId] = useState(null);

  const handleMarkAsPaid = async (referralId, referredUserId) => {
    try {
      setLoadingId(referredUserId);
      const res = await axios.put(`/api/admin/referrals/markAsPaid`, {
        referralId,
        referredUserId,
      });

      if (res.data.success) {
        toast.success("Referral marked as paid!");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update payment status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-[#4d91ff] mb-6">
        Referral Management
      </h1>

      {referalRecord?.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          No referral records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {referalRecord?.map((record) => (
            <Card
              key={record._id}
              className="shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-all bg-white"
            >
              <CardContent className="p-5">
                {/* Parent User Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#4d91ff]" />
                      {record?.user?.fullName}
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {record?.user?.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Referral Code: <span className="font-medium">{record.referralCode}</span>
                    </p>
                  </div>
                  <div className="text-right mt-3 sm:mt-0">
                    <p className="text-sm text-gray-600">Total Referrals:</p>
                    <p className="font-semibold text-gray-800">
                      {record.totalNumberOfReferrals}
                    </p>
                  </div>
                </div>

                {/* Referred Users Table */}
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-sm border border-gray-100 rounded-lg">
                    <thead>
                      <tr className="bg-blue-50 text-gray-700 text-left">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2 text-center">Appointments</th>
                        <th className="p-2 text-center">Status</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record?.referredUsers?.map((ref) => {
                        const eligible = ref.numberOfAppointment >= 25;
                        return (
                          <tr
                            key={ref._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                          >
                            <td className="p-2 font-medium text-gray-800">
                              {ref?.referredUser?.fullName}
                            </td>
                            <td className="p-2 text-gray-600">
                              {ref?.referredUser?.email}
                            </td>
                            <td className="p-2 text-center text-gray-800">
                              {ref.numberOfAppointment}
                            </td>
                            <td
                              className={`p-2 text-center font-medium ${
                                eligible
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {eligible ? "Eligible" : ref.status}
                            </td>
                            <td className="p-2 text-center">
                              {eligible && !ref.bonusCredited ? (
                                <Button
                                  disabled={loadingId === ref._id}
                                  onClick={() =>
                                    handleMarkAsPaid(record._id, ref._id)
                                  }
                                  className="bg-[#4d91ff] hover:bg-[#0d7dd1] text-white px-3 py-1.5 text-xs rounded-lg flex items-center gap-1"
                                >
                                  <IndianRupee className="w-3 h-3" />
                                  {loadingId === ref._id
                                    ? "Processing..."
                                    : "Mark as Paid"}
                                </Button>
                              ) : ref.bonusCredited ? (
                                <span className="flex items-center justify-center text-green-600 text-sm font-medium">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Paid
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  Not eligible
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Last Updated:{" "}
                    {new Date(record.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-semibold text-[#4d91ff] flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {record.bonusEarned} total earned
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default Referrals;
