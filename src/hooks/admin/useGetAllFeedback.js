import { setAllDoctors, setAllFeedback } from '@/redux/adminSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllFeedback = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllFeedback = async () => {
            try {
                const res = await axios.get('/api/admin/getAllFeedbacks',{withCredentials : true});
                if(res.data.success){
                    dispatch(setAllFeedback(res.data.feedbacks));
                    toast.success(res.data.message)
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message)
            }
        }
        fetchAllFeedback()
    },[dispatch])
}

export default useGetAllFeedback