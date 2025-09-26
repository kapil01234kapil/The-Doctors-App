import { setAllDoctors, setAllQueries } from '@/redux/adminSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllQueries = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllQueries = async () => {
            try {
                const res = await axios.get('/api/admin/getAllQueries',{withCredentials : true});
                
                if(res.data.success){
                    dispatch(setAllQueries(res.data.getAllQueries));
                } else{
                    console.log(res.data.message);}
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllQueries()
    },[dispatch])
}

export default useGetAllQueries