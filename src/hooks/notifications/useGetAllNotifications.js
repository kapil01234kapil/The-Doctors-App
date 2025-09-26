import { setAllNotifications } from '@/redux/notificationSlice';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const useGetAllNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications/getUsersAllNotifications', {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllNotifications(res.data.allNotifications));
        } else {
          console.log(res.data.message);}
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllNotifications();
  }, [dispatch]);
};

export default useGetAllNotifications;
