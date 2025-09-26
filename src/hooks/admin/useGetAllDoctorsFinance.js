import { setAllDoctorsFinances } from '@/redux/adminSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllDoctorsFinance = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllDoctorsFinance = async () => {
            try {
                const res =  await axios.get('/api/admin/getAllDoctorsFinances');
                if(res.data.success){
                    dispatch(setAllDoctorsFinances(res.data.latestFinanceRecords))
                }
                else{
                    console.log(res.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllDoctorsFinance()
    },[dispatch])

}

export default useGetAllDoctorsFinance