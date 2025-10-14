"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import useGetAllDoctors from "@/hooks/admin/useGetAllDoctors";
import { useRouter } from "next/navigation";
import { setAllDoctors } from "@/redux/adminSlice";
import axios from "axios";
import toast from "react-hot-toast";

const DoctorsList = () => {
  useGetAllDoctors();
  const { allDoctors } = useSelector((store) => store.admin);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blockReason, setBlockReason] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  // 🔹 New State for Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Pagination setup
  const itemsPerPage = 5;

  // 🔹 Apply Filters
  const filteredDoctors = allDoctors?.filter((doctor) => {
    const matchesSearch =
      doctor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === "all" ||
      doctor?.doctorsProfile?.specializations
        ?.toLowerCase()
        .includes(selectedSpecialization.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && doctor?.doctorsProfile?.verifiedDoctor) ||
      (selectedStatus === "inactive" &&
        !doctor?.doctorsProfile?.verifiedDoctor);

    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors =
    filteredDoctors?.slice(indexOfFirstDoctor, indexOfLastDoctor) || [];
  const totalPages = Math.ceil((filteredDoctors?.length || 0) / itemsPerPage);

  const toggleDropdown = (id) => {
    if (showDropdown === id) {
      setShowDropdown(null);
    } else {
      setShowDropdown(id);
    }
  };

  const handleApprove = async (doctorId) => {
    try {
      const res = await axios.post("/api/admin/approveDoctor", {
        doctorId,
        action: "accept",
      });

      if (res.data.success) {
        toast.success(res.data.message || "Doctor approved successfully!");
        const updatedDoctors = allDoctors.map((doc) =>
          doc._id === res.data.existingDoctor._id
            ? res.data.existingDoctor
            : doc
        );
        dispatch(setAllDoctors(updatedDoctors));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error approving doctor:", error);
      toast.error(error.response?.data?.message || "Failed to approve doctor.");
    }
  };

  const handleBlockDoctor = async () => {
    if (blockReason.length < 10) {
      alert("Reason must be at least 10 characters.");
      return;
    }

    try {
      const res = await axios.post("/api/admin/blockUser", {
        id: selectedDoctor._id,
        name: selectedDoctor.fullName,
        email: selectedDoctor.email,
        phoneNumber: selectedDoctor.contactDetails,
        role: "doctor",
        reasonForBlocking: blockReason,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setShowBlockDialog(false);
        setBlockReason("");

        const updatedDoctors = allDoctors.map((doc) =>
          doc._id === selectedDoctor._id ? { ...doc, blocked: true } : doc
        );
        dispatch(setAllDoctors(updatedDoctors));

        router.push("/admin/blockedUser");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to block doctor.");
    }
  };

  const handleUnblockDoctor = async (doctor) => {
    try {
      const res = await axios.post("/api/admin/unblockUser", {
        id: doctor._id,
        role: "doctor",
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedDoctors = allDoctors.map((doc) =>
          doc._id === doctor._id ? { ...doc, blocked: false } : doc
        );
        dispatch(setAllDoctors(updatedDoctors));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to unblock doctor.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Doctors Management
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* 🔹 Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>

            {/* 🔹 Specialization Filter */}
            <select
              value={selectedSpecialization}
              onChange={(e) => {
                setSelectedSpecialization(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
            >
              <option value="all">All Specializations</option>
              <option value="cardiologist">Cardiologist</option>
              <option value="neurologist">Neurologist</option>
              <option value="dermatologist">Dermatologist</option>
              <option value="pediatrician">Pediatrician</option>
              <option value="gynecologist">Gynecologist</option>
              <option value="orthopedic">Orthopedic</option>
            </select>

            {/* 🔹 Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* 🔹 Table Section (unchanged) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UPI ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDoctors?.map((doctor) => (
                <tr key={doctor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={doctor?.profilePhoto}
                          alt={doctor.fullName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {doctor?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doctor?.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doctor?.contactDetails}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor?.doctorsProfile?.specializations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor?.createdAt.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor?.successfullAppointments || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor?.doctorsProfile?.verifiedDoctor ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <XCircle size={12} className="mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor?.upiId || "Not Provided"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <button
                      onClick={() => toggleDropdown(doctor?._id)}
                      className="text-gray-400 cursor-pointer hover:text-gray-500"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {showDropdown === doctor?._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() =>
                              router.push("/admin/doctor-verification")
                            }
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Eye size={16} className="mr-2" />
                            View Details
                          </button>

                          {!doctor?.doctorsProfile?.verifiedDoctor && (
                            <button
                              onClick={() => handleApprove(doctor?._id)}
                              className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Verify
                            </button>
                          )}

                          {doctor?.blocked ? (
                            <button
                              onClick={() => handleUnblockDoctor(doctor)}
                              className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setShowBlockDialog(true);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <Ban size={16} className="mr-2" />
                              Block
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{indexOfFirstDoctor + 1}</span> to{" "}
            <span className="font-medium">
              {indexOfLastDoctor > filteredDoctors?.length
                ? filteredDoctors?.length
                : indexOfLastDoctor}
            </span>{" "}
            of <span className="font-medium">{filteredDoctors?.length}</span>{" "}
            doctors
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Block Modal (unchanged) */}
      {showBlockDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Block Doctor</h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              placeholder="Enter reason for blocking..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBlockDialog(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockDoctor}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
