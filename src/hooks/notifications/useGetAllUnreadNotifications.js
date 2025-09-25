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
        const res = await axios.get('/api/notifications/getAllUnreadNotifications', {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllNotifications(res.data.unreadNotifications));
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message || "Failed to fetch notifications");
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };
    fetchAllNotifications();
  }, [dispatch]);
};

export default useGetAllNotifications;
