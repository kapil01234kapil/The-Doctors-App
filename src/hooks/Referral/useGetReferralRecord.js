"use client"

import { setReferDetails } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetReferralRecord = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllRecord = async () => {
      try {
        const res = await axios.get("/api/refer-earn/getPersonalReferRecord", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setReferDetails(res.data.ReferRecord));
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something Went Wrong");
      }
    };
    fetchAllRecord();
  }, [dispatch]);
};

export default useGetReferralRecord;
