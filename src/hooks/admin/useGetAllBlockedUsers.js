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
                } else{
                    console.log(res.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllBlockedUsers()
    },[dispatch])
}

export default useGetAllBlockedUsers