import { setAllDoctors } from '@/redux/authSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllDoctors = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllDoctors = async() => {
            try {
                const res = await axios.get('/api/doctor/getAllDoctor')
                if(res.data.success){
                    dispatch(setAllDoctors(res.data.doctors))
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllDoctors()
    },[dispatch])
}

export default useGetAllDoctors