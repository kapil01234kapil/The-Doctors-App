import { setAdminAllAppointments, setAllDoctors } from '@/redux/adminSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllAppointments = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllAppointments = async () => {
            try {
                const res = await axios.get('/api/admin/getAllAppointments',{withCredentials : true});
                if(res.data.success){
                    dispatch(setAdminAllAppointments(res.data.allAppointments));
                    toast.success(res.data.message)
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message)
            }
        }
        fetchAllAppointments()
    },[dispatch])
}

export default useGetAllAppointments