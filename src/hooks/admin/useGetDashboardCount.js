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
          toast.success(res.data.message);
        } else{
            toast.error(res.data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };
    fetchDashboardCount();
  }, [dispatch]);
};

export default useGetDashboardCount;
