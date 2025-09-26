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
                } else{
                    console.log(res.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAppointments()
    },[dispatch])
}

export default useGetAllAppointments