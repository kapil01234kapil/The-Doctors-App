import { setAllAppointments } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAllDoctorsAppointments = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAppointments =  async () =>{
        try {
            const res = await axios.get('/api/doctor/getAllAppointments',{withCredentials:true})
            console.log("All the confirmed appointments",res.data.appointments)
            dispatch(setAllAppointments(res.data.appointments));
            toast.success(res.data.message)
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }
    fetchAllAppointments()
  },[dispatch])
  
};

export default useGetAllDoctorsAppointments;
