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
        } else {
          console.log(res.data.message);}
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllRecord();
  }, [dispatch]);
};

export default useGetReferralRecord;
