import { setWeeklySchedule } from "@/redux/scheduleSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetDoctorsWeeklySchedule = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWeeklySchedule = async () => {
      try {
        const res = await axios.get("/api/doctor/getDoctorCalendar", {
          withCredentials: true,
        });
        if(res.data.success){
            dispatch(setWeeklySchedule(res.data.weeklySchedule))

        }else{
            console.log(res.data.message);}
      } catch (error) {
        console.log(error);
      }
    };
    fetchWeeklySchedule()
  }, [dispatch]);
};

export default useGetDoctorsWeeklySchedule;
