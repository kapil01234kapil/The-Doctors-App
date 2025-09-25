"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  AlertCircle,
  Trash2,
  Filter,
  Search,
  X,
} from "lucide-react";
import useGetAllNotifications from "@/hooks/notifications/useGetAllNotifications";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import axios from "axios";
import { setSelectedNotification } from "@/redux/notificationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const NotificationPagePatient = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentRatingNotifId, setCurrentRatingNotifId] = useState(null);
  const [id, setCurrentDoctorId] = useState(null);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useGetAllNotifications();
  const { allNotifications } = useSelector((store) => store.notification);

  useEffect(() => {
    const mappedNotifications = allNotifications.map((notif) => ({
      id: notif._id,
      type: notif.type.toLowerCase(),
      title: notif.title,
      message: notif.message,
      time: moment(notif.createdAt).fromNow(),
      read: notif.isRead,
      priority: notif.highPriority ? "high" : "medium",
      doctorId: notif.sender,
      reviewGiven: notif.reviewGiven || false,
    }));
    setNotifications(mappedNotifications);
  }, [allNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
      case "appointment_confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "appointment_reminder":
        return <Clock className="w-5 h-5 text-[#4d91ff]" />;
      case "payment":
      case "payment_received":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case "review":
      case "rating_request":
      case "feedback":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "appointment_cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-400";
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notif.read) ||
      (filter === "read" && notif.read) ||
      (filter === "high" && notif.priority === "high");

    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const markSingleNotification = async (notificationId) => {
    try {
      if (!notificationId) {
        toast.error("Notification ID not found");
        return;
      }

      const res = await axios.patch(
        "/api/notifications/markOneNotification",
        { notificationId },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !feedback.trim()) {
      toast.error("Please provide both rating and feedback");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `/api/patient/rateDoctor/${id}`,
        {
          rating,
          feedback,
          notificationId: currentRatingNotifId,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Review submitted successfully!");
        setRatingDialogOpen(false);
        setRating(0);
        setFeedback("");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  ">
      {/* --- Top Navbar --- */}
      <div className="bg-white w-full text-center  rounded-b-lg shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-6">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div className="relative">
                <Bell className="w-6 h-6 text-[#4d91ff]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Notifications
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-500 hover:text-[#4d91ff] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
              {unreadCount > 0 && (
                <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#4d91ff] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Notifications List --- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search + Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent outline-none transition-all text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "unread", label: "Unread" },
                { key: "read", label: "Read" },
                { key: "high", label: "High Priority" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    filter === key
                      ? "bg-[#4d91ff] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border-l-4 ${getPriorityColor(
                  notification.priority
                )} shadow-sm hover:shadow-md transition-shadow ${
                  !notification.read ? "border-r-4 border-r-[#4d91ff]" : ""
                }`}
              >
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                      <div className="flex items-center space-x-2 mb-1 flex-wrap">
                        <h3
                          className={`text-sm sm:text-base font-medium truncate ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[#4d91ff] rounded-full flex-shrink-0"></span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{notification.time}</span>
                        </span>
                      </div>

                      {notification.type === "feedback" &&
                        (!notification.reviewGiven ? (
                          <button
                            onClick={() => {
                              setCurrentRatingNotifId(notification.id);
                              setCurrentDoctorId(notification.doctorId);
                              setRatingDialogOpen(true);
                            }}
                            className="mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4d91ff] text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Rate Now
                          </button>
                        ) : (
                          <span className="mt-2 sm:mt-3 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 text-xs sm:text-sm rounded-lg">
                            Review Given
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2 sm:mt-0 ml-0 sm:ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => {
                          markAsRead(notification.id);
                          dispatch(setSelectedNotification(notification.id));
                          markSingleNotification(notification.id);
                        }}
                        className="p-1 text-gray-400 hover:text-[#4d91ff] transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        deleteNotification(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Rating Dialog --- */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Rate the Doctor</DialogTitle>
          </DialogHeader>

          <div className="py-4 flex flex-col gap-4">
            <label className="text-sm font-medium">Rating (1 to 5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />

            <label className="text-sm font-medium">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="border p-2 rounded w-full"
              rows={4}
            />

            <Button
              onClick={handleSubmitReview}
              disabled={loading}
              className="bg-[#4d91ff] text-white"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationPagePatient;
