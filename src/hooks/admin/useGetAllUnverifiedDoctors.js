import { setUnverifiedDoctors } from "@/redux/adminSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAllUnverifiedDoctors = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllUnverifiedDoctors = async () => {
      try {
        const res = await axios.get("/api/admin/getUnverifiedDoctors", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUnverifiedDoctors(res.data.unverifiedDoctors));
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message);
      }
    };
    fetchAllUnverifiedDoctors();
  }, [dispatch]);
};

export default useGetAllUnverifiedDoctors;
