"use client"

import { setReferRecords } from '@/redux/adminSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllReferalRecords = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchReferalRecords = async () => {
            try {
                const res = await axios.get('/api/admin/getAllReferRecords',{withCredentials : true})
                if(res.data.success){
                    toast.success(res.data.message)
                    dispatch(setReferRecords(res.data.allReferUser))
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Something went wrong")
            }
        }
        fetchReferalRecords()
    },[dispatch])
}

export default useGetAllReferalRecords