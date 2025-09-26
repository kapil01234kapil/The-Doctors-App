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
                } else{
                    console.log(res.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPatients()
    },[dispatch])
}

export default useGetAllPatients