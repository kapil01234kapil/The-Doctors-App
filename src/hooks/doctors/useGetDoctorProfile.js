import { setSelectedDoctor } from '@/redux/authSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetDoctorProfile = (id) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchDoctorProfile  = async () => {
            try {
                const res = await axios.get(`/api/patient/getDoctorProfile/${id}`,{withCredentials:true})
                if(res.data.success){
                   dispatch(setSelectedDoctor(res.data.doctor)) 
                } else{
                    console.log(res.data.message);}
            } catch (error) {
                console.log(error);
            }
        }
        fetchDoctorProfile()
    },[dispatch,id])
}

export default useGetDoctorProfile