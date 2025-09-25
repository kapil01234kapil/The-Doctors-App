"use client";

import React, { useState } from "react";
import { Search, CheckCircle, UserRound, Users } from "lucide-react";
import useGetAllBlockedUsers from "@/hooks/admin/useGetAllBlockedUsers";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setBlockedUsers } from "@/redux/adminSlice";

const BlockedUsers = () => {
  const dispatch = useDispatch();
  useGetAllBlockedUsers();
  const { blockedUsers } = useSelector((store) => store.admin);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const filteredUsers = blockedUsers
    .filter(
      (user) =>
        filter === "all" || user.type.toLowerCase() === filter.toLowerCase()
    )
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openUnblockDialog = (userId) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  const closeUnblockDialog = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleUnblockConfirm = async () => {
    try {
      console.log("this is the id",selectedUserId)
      const res = await axios.post("/api/admin/unblockUser", {
        id: selectedUserId,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        closeUnblockDialog();

        // Remove the unblocked user from blockedUsers in Redux
        dispatch(
          setBlockedUsers(
            blockedUsers.filter((user) => user.id !== res.data.deletedUser.id)
          )
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data.message || "Something Went Wrong");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Blocked Users</h1>
      <div className="bg-white rounded-lg shadow">
        {/* Search + Filter */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                filter === "all"
                  ? "bg-[#4d91ff] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setFilter("all")}
            >
              <Users size={16} />
              <span>All</span>
            </button>
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                filter === "doctor"
                  ? "bg-[#4d91ff] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setFilter("doctor")}
            >
              <UserRound size={16} />
              <span>Doctors</span>
            </button>
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                filter === "patient"
                  ? "bg-[#4d91ff] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setFilter("patient")}
            >
              <Users size={16} />
              <span>Patients</span>
            </button>
          </div>
        </div>

        {/* Blocked Users List */}
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No blocked users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.type === "Doctor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{user._id}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="mx-2 text-gray-300">|</span>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openUnblockDialog(user.userId)}
                    className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    <CheckCircle size={14} className="mr-1.5" />
                    Unblock User
                  </button>
                </div>

                <div className="mt-3 ml-16">
                  <p className="text-xs text-gray-500">
                    Blocked on: {user?.blockedDate?.split("T")?.[0]}
                  </p>
                  <div className="mt-2 bg-red-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-red-800">
                      Reason for blocking:
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {user?.reasonForBlocking}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unblock Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
            <h2 className="text-lg font-semibold mb-4">Confirm Unblock</h2>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to unblock this user?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeUnblockDialog}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUnblockConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedUsers;
