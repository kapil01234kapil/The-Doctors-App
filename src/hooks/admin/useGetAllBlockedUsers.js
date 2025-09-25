import { setBlockedUsers } from '@/redux/adminSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const useGetAllBlockedUsers = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllBlockedUsers = async () => {
            try {
                const res = await axios.get('/api/admin/getAllBlockedUsers',{withCredentials : true});
                if(res.data.success){
                    dispatch(setBlockedUsers(res.data.allBlockedUsers));
                    toast.success(res.data.message)
                } else{
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message)
            }
        }
        fetchAllBlockedUsers()
    },[dispatch])
}

export default useGetAllBlockedUsers