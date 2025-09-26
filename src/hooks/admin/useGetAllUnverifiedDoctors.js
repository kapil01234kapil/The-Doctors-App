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
        } else {
          console.log(res.data.message);}
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUnverifiedDoctors();
  }, [dispatch]);
};

export default useGetAllUnverifiedDoctors;
