import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetUnpaidAppointments = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUnpaidAppointments = async () => {
            try {
                const res = await axios.get('/api/patient/getUnpaidAppointments',{withCredentials : true});
                
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message || "Something went wrong");
                
            }
        }
    },[dispatch])
}

export default useGetUnpaidAppointments