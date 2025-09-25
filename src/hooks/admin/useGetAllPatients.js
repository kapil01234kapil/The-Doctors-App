import { setAllPatients } from '@/redux/adminSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllPatients = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const res = await axios.get('/api/admin/getAllPatients',{withCredentials : true});
                if(res.data.success){
                    dispatch(setAllPatients(res.data.patients));
                    toast.success(res.data.message)
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message)
            }
        }
        fetchAllPatients()
    },[dispatch])
}

export default useGetAllPatients