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
                } else{
                    console.log(res.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllFeedback()
    },[dispatch])
}

export default useGetAllFeedback