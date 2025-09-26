import { setDashboardCount } from "@/redux/adminSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetDashboardCount = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchDashboardCount = async () => {
      try {
        const res = await axios.get("/api/admin/getCount", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setDashboardCount(res.data.count));
        } else{
          console.log(res.data.message);}
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboardCount();
  }, [dispatch]);
};

export default useGetDashboardCount;
