import { setDoctorFinanceRecords } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetFinanceRecords = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchFinanceRecords = async () => {
            try {
                const res = await axios.get('/api/doctor/getFinanceRecord',{withCredentials: true});
                if(res.data.success){
                    dispatch(setDoctorFinanceRecords(res.data.financialRecords));
                    toast.success(res.data.message)
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Something went wrong")
            }
        }
        fetchFinanceRecords()
    },[dispatch])
}

export default useGetFinanceRecords