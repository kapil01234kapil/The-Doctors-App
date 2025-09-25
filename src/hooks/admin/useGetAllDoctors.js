import { setAllDoctors } from '@/redux/adminSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllDoctors = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllDoctors = async () => {
            try {
                const res = await axios.get('/api/admin/getAllDoctors',{withCredentials : true});
                if(res.data.success){
                    dispatch(setAllDoctors(res.data.doctors));
                    toast.success(res.data.message)
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message)
            }
        }
        fetchAllDoctors()
    },[dispatch])
}

export default useGetAllDoctors