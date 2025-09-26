import { setAllAppointments } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAllPatientsAppointments = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const res = await axios.get("/api/patient/getAllAppointments", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAppointments(res.data.confirmedAppointments));
        } else{
          console.log(res.data.message);}
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllAppointments();
  }, [dispatch]);
};

export default useGetAllPatientsAppointments;
