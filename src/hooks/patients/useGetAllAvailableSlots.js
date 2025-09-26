import { setAllAvailableSlots } from '@/redux/scheduleSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllAvailableSlots = (id) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllAvailableSlots = async () => {
            try {
                const res = await axios.get(`/api/patient/getDoctorSlots/${id}`);
                if(res.data.success){
                    toast.success(res.data.message);
                    dispatch(setAllAvailableSlots(res.data.allSlots.allSlot))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAvailableSlots()
    },[dispatch,id])
}

export default useGetAllAvailableSlots