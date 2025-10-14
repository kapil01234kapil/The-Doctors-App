"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import useGetAllFeedback from "@/hooks/admin/useGetAllFeedback";

const AdminFeedbackPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useGetAllFeedback();
  const { allFeedbacks } = useSelector((store) => store.admin);
  console.log("feedback structure", allFeedbacks);

  // ✅ Updated search logic to use user.fullName and user.email
  const filteredFeedback = allFeedbacks?.filter((feedback) => {
    const name = feedback?.user?.fullName?.toLowerCase() || "";
    const email = feedback?.user?.email?.toLowerCase() || "";
    const query = searchTerm.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Feedback Management</h1>

      {/* 🔍 Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {/* Feedback Section */}
      {filteredFeedback?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500">No feedbacks available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 🧑 User List */}
          <div className="bg-white rounded-lg shadow max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredFeedback?.map((user) => (
              <div
                key={user._id}
                className={`p-4 cursor-pointer flex items-center space-x-4 hover:bg-gray-50 ${
                  selectedUser?._id === user._id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={user?.user?.profilePhoto || "/default-user.png"}
                  alt={user?.user?.fullName || "User"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user?.fullName || "Unnamed User"}
                  </p>
                  {/* ✅ Email made visible */}
                  <p className="text-xs text-gray-500">
                    {user?.user?.email || "No email"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.user?.role || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 💬 Feedback Detail */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {selectedUser ? (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Feedback from {selectedUser?.user?.fullName}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Email: {selectedUser?.user?.email}
                </p>

                {selectedUser?.feedback?.length > 0 ? (
                  selectedUser.feedback.map((item, idx) => (
                    <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800">{item.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(item.timeOfFeedback).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No feedback available.</p>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full mt-10">
                <p className="text-gray-500">
                  Select a user from the list to view their feedback
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPanel;
