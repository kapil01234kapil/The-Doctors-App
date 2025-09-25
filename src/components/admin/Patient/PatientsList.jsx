"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  Edit,
  CheckCircle,
} from "lucide-react";
import useGetAllPatients from "@/hooks/admin/useGetAllPatients";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PatientsList = () => {
  const router = useRouter()
  useGetAllPatients();
  const { allPatients } = useSelector((store) => store.admin);

  const [patients, setPatients] = useState([
    {
      id: "PAT-2001",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 9876543220",
      joinDate: "2023-08-15",
      appointments: 8,
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: "PAT-2002",
      name: "Ananya Singh",
      email: "ananya.singh@example.com",
      phone: "+91 9876543221",
      joinDate: "2023-08-22",
      appointments: 5,
      status: "Active",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: "PAT-2003",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "+91 9876543222",
      joinDate: "2023-09-01",
      appointments: 3,
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/13.jpg",
    },
    {
      id: "PAT-2004",
      name: "Priya Mehta",
      email: "priya.mehta@example.com",
      phone: "+91 9876543223",
      joinDate: "2023-09-08",
      appointments: 6,
      status: "Inactive",
      image: "https://randomuser.me/api/portraits/women/14.jpg",
    },
    {
      id: "PAT-2005",
      name: "Rajiv Kapoor",
      email: "rajiv.kapoor@example.com",
      phone: "+91 9876543224",
      joinDate: "2023-09-15",
      appointments: 2,
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
      id: "PAT-2006",
      name: "Meera Reddy",
      email: "meera.reddy@example.com",
      phone: "+91 9876543225",
      joinDate: "2023-09-22",
      appointments: 4,
      status: "Active",
      image: "https://randomuser.me/api/portraits/women/16.jpg",
    },
  ]);

  const [showDropdown, setShowDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [blockReason, setBlockReason] = useState("");

  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const openBlockDialog = (patient) => {
    setSelectedPatient(patient);
    setBlockReason("");
    setIsDialogOpen(true);
  };

  const closeBlockDialog = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
    setBlockReason("");
  };

  const handleBlockSubmit = async () => {
    if (blockReason.length < 10) {
      alert("Reason must be at least 10 characters.");
      return;
    }

    try {
      
      const res = await axios.post("/api/admin/blockUser", {
        id: selectedPatient._id,
        name: selectedPatient.fullName,
        email: selectedPatient.email,
        phoneNumber: selectedPatient.contactDetails,
        role: "patient",
        reasonForBlocking: blockReason,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        closeBlockDialog();
        router.push("/admin/blockedUser")
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to block user.");
    }
  };

  const indexOfLastPatient = currentPage * itemsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
  const currentPatients =
    allPatients?.slice(indexOfFirstPatient, indexOfLastPatient) || [];
  const totalPages = Math.ceil(allPatients?.length / itemsPerPage || 1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Patients Management
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search patients..."
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

            <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upi ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentPatients.map((patient) => (
                <tr key={patient?._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={patient?.profilePhoto}
                          alt={patient.fullName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient?._id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient?.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient?.contactDetails}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient?.createdAt.split("T")[0]}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient?.successfullAppointments || 0}
                  </td>

                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient?.upiId || "Not Provided"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        patient?.verified === true
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {patient.verified === true ? "Verified" : "Not Verified"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <button
                      onClick={() => toggleDropdown(patient._id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {showDropdown === patient._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <Eye size={16} className="mr-2" />
                            View Details
                          </button>

                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <Edit size={16} className="mr-2" />
                            Edit
                          </button>

                          {patient?.blocked === true ? (
                            <button className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left">
                              <Ban size={16} className="mr-2" />
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() => openBlockDialog(patient)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <CheckCircle size={16} className="mr-2" />
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

        <div className="px-4 py-3 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{indexOfFirstPatient + 1}</span> to{" "}
            <span className="font-medium">
              {indexOfLastPatient > allPatients?.length
                ? allPatients?.length
                : indexOfLastPatient}
            </span>{" "}
            of <span className="font-medium">{allPatients?.length}</span>{" "}
            patients
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

      {/* Block User Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
            <h2 className="text-lg font-semibold mb-4">Block User</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Blocking
            </label>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4d91ff]"
              rows={4}
              placeholder="Enter reason (min 10 characters)"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeBlockDialog}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsList;
