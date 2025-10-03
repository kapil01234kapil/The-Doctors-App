"use client";

import useGetReferralRecord from "@/hooks/Referral/useGetReferralRecord";
import { Calendar, Copy, IndianRupee, Share2, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { setUser } from "@/redux/authSlice"; // adjust path if different

const HeroReferEarn = () => {
  useGetReferralRecord();
  const { referDetails, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [upiId, setUpiId] = useState("");

 const handleCopyCode = () => {
  if (referDetails?.referralCode) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(referDetails.referralCode)
        .then(() => toast.success("Referral code copied to clipboard!"))
        .catch(() => toast.error("Failed to copy referral code."));
    } else {
      // Fallback: use a temporary textarea
      const textArea = document.createElement("textarea");
      textArea.value = referDetails.referralCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Referral code copied!");
      } catch (err) {
        toast.error("Fallback copy failed.");
      }
      document.body.removeChild(textArea);
    }
  } else {
    toast.error("Referral code not available");
  }
};

  const handleAddUpiId = async () => {
    if (!upiId) {
      toast.error("Please enter a UPI ID");
      return;
    }

    try {
      const res = await axios.post("/api/upiId/add", { upiId });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser({ ...user, upiId: res.data.upiId }));
        setUpiId(""); // clear input
      } else {
        toast.error(res.data.message || "Failed to add UPI ID");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add UPI ID");
    }
  };

  return (
    <div className="w-full bg-white mt-3 h-full min-h-screen p-4 md:p-6 lg:p-10">
      {/* Heading */}
      <div className="flex justify-center">
        <div className="flex flex-col mt-7 justify-center items-center gap-4 text-center">
          <h1 className="font-bold text-2xl md:text-3xl">Refer and Earn</h1>
          <p className="text-sm md:text-base text-slate-600">
            Refer doctors to our platform and earn rewards when they complete
            bookings
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-5 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-5">
          <div className="bg-white border-2 border-slate-400 rounded-md p-4 flex gap-3">
            <IndianRupee />
            <div className="flex flex-col gap-1">
              <p className="text-sm">Total Earning</p>
              <h1 className="text-xl font-semibold">
                {referDetails?.bonusEarned}
              </h1>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-400 rounded-md p-4 flex gap-3">
            <IndianRupee />
            <div className="flex flex-col gap-1">
              <p className="text-sm">Total Referrals</p>
              <h1 className="text-xl font-semibold">
                {referDetails?.totalNumberOfReferrals || 0}
              </h1>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-400 rounded-md p-4 flex gap-3">
            <IndianRupee />
            <div className="flex flex-col gap-1">
              <p className="text-sm">Successful Referrals</p>
              <h1 className="text-xl font-semibold">
                {referDetails?.successfullReferrals || 0}
              </h1>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-400 rounded-md p-4 flex gap-3">
            <IndianRupee />
            <div className="flex flex-col gap-1">
              <p className="text-sm">Pending Referrals</p>
              <h1 className="text-xl font-semibold">
                {(referDetails?.totalNumberOfReferrals || 0) -
                  (referDetails?.successfullReferrals || 0)}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="w-full p-5">
        <div className="bg-white w-full p-6 md:p-8 flex flex-col gap-5 rounded-md">
          <p className="text-lg font-semibold">Your Referral Code</p>
          <p className="text-slate-500 text-sm">
            Share this code with doctors to invite them to our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="border w-full border-blue-300 bg-blue-50 rounded-md p-3 text-center">
              <h1 className="font-mono">
                {referDetails?.referralCode || "No Code Available"}
              </h1>
            </div>

            <div className="flex gap-2 sm:w-1/3 justify-between">
              <button
                onClick={handleCopyCode}
                className="flex-1 flex gap-2 p-3 justify-center items-center cursor-pointer rounded-md bg-blue-700 text-white text-sm"
              >
                <Copy size={16} />
                Copy
              </button>

              <button className="flex-1 flex gap-2 p-3 justify-center cursor-pointer items-center rounded-md bg-green-700 text-white text-sm">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ UPI ID Section */}
      <div className="w-full p-5">
        <div className="bg-white w-full p-6 md:p-8 flex flex-col gap-5 rounded-md">
          <p className="text-lg font-semibold">Your UPI ID</p>
          {user?.upiId ? (
            <p className="text-slate-700">
              <span className="font-bold">UPI ID:</span> {user.upiId}
            </p>
          ) : (
            <p className="text-slate-500 text-sm">UPI ID not added yet</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter your UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="border border-slate-300 rounded-md p-3 flex-1"
            />
            <button
              onClick={handleAddUpiId}
              className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="w-full p-5">
        <div className="bg-white rounded-md flex flex-col gap-8 justify-center items-center w-full p-6 md:p-8">
          <p className="font-bold text-lg">How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col justify-between items-center gap-2">
              <div className="bg-blue-100 rounded-full p-4">
                <UserPlus className="text-blue-500" size={60} />
              </div>
              <h1 className="font-bold text-lg">Refer A Doctor</h1>
              <p className="text-sm text-slate-600">
                Share your unique referral code with doctors who aren't yet on
                our platform
              </p>
            </div>

            <div className="flex flex-col justify-between items-center gap-2">
              <div className="bg-blue-100 rounded-full p-4">
                <Calendar className="text-blue-500" size={60} />
              </div>
              <h1 className="font-bold text-lg">Doctor Completes Booking</h1>
              <p className="text-sm text-slate-600">
                When your referred doctors join and complete 25 booking
                appointments
              </p>
            </div>

            <div className="flex flex-col justify-between items-center gap-2">
              <div className="bg-blue-100 rounded-full p-4">
                <IndianRupee className="text-blue-500" size={60} />
              </div>
              <h1 className="font-bold text-lg">Earn Rewards</h1>
              <p className="text-sm text-slate-600">
                You earn ₹100 for each doctor who successfully completes 25
                bookings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroReferEarn;
