import { setUnreadNotificationsCount } from '@/redux/notificationSlice';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const useGetCountUnreadNotifications = (user, pathname) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || user === null) return; // Early exit if no user

    const fetchTotalCount = async () => {
      try {
        const res = await axios.get('/api/notifications/getAllUnreadNotificationsCount', { withCredentials: true });
        if (res.data.success) {
          dispatch(setUnreadNotificationsCount(res.data.unreadCount));
        } else {
          console.log(res.data.message);}
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalCount();
  }, [user, pathname, dispatch]);
};

export default useGetCountUnreadNotifications;
