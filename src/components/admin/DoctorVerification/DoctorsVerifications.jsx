"use client";

import React, { useState } from "react";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import useGetAllUnverifiedDoctors from "@/hooks/admin/useGetAllUnverifiedDoctors";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setUnverifiedDoctors } from "@/redux/adminSlice";

const DoctorVerification = () => {
  useGetAllUnverifiedDoctors();
  const { unverifiedDoctors } = useSelector((store) => store.admin);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const dispatch = useDispatch();

  // ✅ Approve Doctor
  const handleApprove = async (doctorId) => {
    try {
      const res = await axios.post("/api/admin/approveDoctor", {
        doctorId,
        action: "accept",
      });

      if (res.data.success) {
        toast.success(res.data.message || "Doctor approved successfully!");

        const updatedDoctors = unverifiedDoctors.filter(
          (doc) => doc._id !== res.data.existingDoctor._id
        );
        dispatch(setUnverifiedDoctors(updatedDoctors));
        setSelectedDoctor(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error approving doctor:", error);
      toast.error(error.response?.data?.message || "Failed to approve doctor.");
    }
  };

  // ✅ Reject Doctor
  const handleReject = async (doctorId) => {
    try {
      const res = await axios.post("/api/admin/approveDoctor", {
        doctorId,
        action: "rejected",
      });
      if (res.data.success) {
        dispatch(
          setUnverifiedDoctors((prev) =>
            prev.filter((doc) => doc._id !== res.data.existingUser._id)
          )
        );
        toast.success(res.data.message || "Doctor rejected successfully!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error(error.response?.data?.message || "Failed to reject doctor.");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Doctor Verification</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Doctor List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Pending Verification</h2>
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* ✅ Show message if no unverified doctors */}
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
            {unverifiedDoctors?.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                🎉 All doctors are verified. No pending requests.
              </div>
            ) : (
              unverifiedDoctors?.map((doctor) => (
                <div
                  key={doctor._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedDoctor?._id === doctor._id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center">
                    <img
                      src={doctor.profilePhoto || "/default-doctor.png"}
                      alt={doctor.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {doctor.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doctor.doctorsProfile?.specializations}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(doctor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctor Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedDoctor ? (
            <div>
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <img
                      src={selectedDoctor.profilePhoto || "/default-doctor.png"}
                      alt={selectedDoctor.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedDoctor.fullName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedDoctor.doctorsProfile?.specializations}
                      </p>
                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-sm text-gray-500">
                          {selectedDoctor.email}
                        </p>
                        <span className="text-gray-300">|</span>
                        <p className="text-sm text-gray-500">
                          {selectedDoctor.contactDetails}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Verification
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Documents Verification
                </h3>
                <div className="space-y-4">
                  {Object.entries(
                    selectedDoctor.doctorsProfile?.proofs || {}
                  ).map(([key, url]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText size={20} className="text-gray-400" />
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {key}
                          </span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending Review
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#4d91ff] hover:underline flex items-center"
                        >
                          <ExternalLink size={14} className="mr-1" />
                          View Document
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Education
                      </h4>
                      <p className="text-sm text-gray-600">
                        {
                          selectedDoctor.doctorsProfile?.essentials
                            ?.completionOfDegree
                        }{" "}
                        - {selectedDoctor.doctorsProfile?.essentials?.institute}
                      </p>
                      <p className="text-sm text-gray-600">
                        {
                          selectedDoctor.doctorsProfile?.essentials
                            ?.registrationCouncil
                        }{" "}
                        (
                        {
                          selectedDoctor.doctorsProfile?.essentials
                            ?.registrationNumber
                        }
                        )
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Experience
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedDoctor.doctorsProfile?.experience} Years
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approve / Reject Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleReject(selectedDoctor._id)}
                    className="px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleApprove(selectedDoctor._id)}
                    className="px-4 cursor-pointer py-2 bg-[#4d91ff] text-white rounded-lg hover:bg-blue-600"
                  >
                    Approve & Verify
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-[#4d91ff]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No doctor selected
              </h3>
              <p className="text-sm text-gray-500">
                Select a doctor from the list to view and verify their documents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification;
