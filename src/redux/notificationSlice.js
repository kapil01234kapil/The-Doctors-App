import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    allNotifications: [],
    unreadNotifications: [],
    selectedNotification : null,
    unreadNotificationsCount : 0,
  },
  reducers: {
    setAllNotifications: (state, action) => {
      state.allNotifications = action.payload;
    },
    setAllUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    clearNotifications: (state) => {
      state.allNotifications = [];
      state.unreadNotifications = [];
    },
     markAsRead: (state, action) => {
      const id = action.payload;
      state.allNotifications = state.allNotifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      );
      state.unreadNotifications = state.unreadNotifications.filter(n => n._id !== id);
    },
    setSelectedNotification : (state,action) => {
      state.selectedNotification = action.payload;
    },
    setUnreadNotificationsCount : (state,action) => {
      state.unreadNotificationsCount = action.payload
    }
  },
});

export const { setAllNotifications, setAllUnreadNotifications,markAsRead,clearNotifications,setSelectedNotification ,setUnreadNotificationsCount} =
  notificationSlice.actions;
export default notificationSlice.reducer;
