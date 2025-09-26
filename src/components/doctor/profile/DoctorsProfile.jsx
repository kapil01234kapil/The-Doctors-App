"use client";

import RatingStars from "@/components/shared/RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  IndianRupee,
  Mail,
  MapPin,
  Pen,
  Phone,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";

const DoctorsProfile = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const { user, allAppointments } = useSelector((store) => store.auth);

  const [form, setForm] = useState({
    name: user?.fullName || "",
    specialization: user?.doctorsProfile?.specializations || "",
    address:
      user?.doctorsProfile?.clinic?.[0].clinicAddress ||
      "6391 Eight St. Clejin, Dejawarne",
    phone: user?.contactDetails || "",
    email: user?.email || "",
    fees: user?.doctorsProfile?.consultationFees || "",
    college:
      user?.doctorsProfile?.essentials?.institute || "Galgotias University",
    state:
      user?.doctorsProfile?.essentials?.instituteLocation || "Greater Noida",
    experience: user?.doctorsProfile?.experience || "",
    qualification:
      user?.doctorsProfile?.qualifications?.map((item) => item) || "MBBS",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.post("/api/doctor/editProfile", form, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.updatedUser));
        setIsEditing(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Internal Server Error");
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("profilePhoto", selectedFile);

      const res = await axios.post("/api/doctor/updatePhoto", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(
          setUser({
            ...user,
            profilePhoto: res.data.url,
          })
        );
        setSelectedFile(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    }
  };

  // ---------------- Consultation Overview Logic ----------------
  const today = moment().format("YYYY-MM-DD");

  const todaysConsultations = allAppointments.filter(
    (appt) =>
      moment(appt.appointmentDate).format("YYYY-MM-DD") === today &&
      appt.status !== "cancelled"
  );

  const upcomingConsultations = allAppointments.filter(
    (appt) =>
      moment(appt.appointmentDate).isAfter(today, "day") &&
      appt.status !== "cancelled"
  );

  const completedConsultations = allAppointments.filter(
    (appt) => appt.status === "completed"
  );

  const cancelledConsultations = allAppointments.filter(
    (appt) => appt.status === "cancelled"
  );

  const calcEarnings = (appts) =>
    appts.reduce((sum, appt) => sum + (appt.consultationFees || 0), 0);

  const stats = [
    {
      label: "Today's Consultations",
      count: todaysConsultations.length,
      earning: calcEarnings(todaysConsultations),
    },
    {
      label: "Upcoming Consultations",
      count: upcomingConsultations.length,
      earning: calcEarnings(upcomingConsultations),
    },
    {
      label: "Completed Consultations",
      count: completedConsultations.length,
      earning: calcEarnings(completedConsultations),
    },
    {
      label: "Cancelled Consultations",
      count: cancelledConsultations.length,
      earning: calcEarnings(cancelledConsultations),
    },
  ];
  // -------------------------------------------------------------

  return (
    <div className="w-full flex flex-col lg:flex-row bg-slate-50 justify-center gap-5 p-4">
      {/* Left Section */}
      <div className="flex bg-white rounded-2xl p-3 flex-col gap-8 w-full lg:w-2/3">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row justify-between gap-6 p-4">
          {/* Profile + Edit */}
          <div className="w-full md:w-1/3 flex gap-2 items-start">
            <div className="rounded-xl border-black border-2 relative w-full md:w-auto">
              <Image
                src={user?.profilePhoto || "/heroAbout.png"}
                alt="Doctor image"
                width={500}
                height={500}
                className="rounded-xl object-cover w-full h-auto md:h-64"
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />

              <Pen
                className="text-blue-500 cursor-pointer"
                size={24}
                onClick={() => fileInputRef.current.click()}
              />

              {selectedFile && (
                <Button
                  onClick={handleSavePhoto}
                  variant="outline"
                  className="rounded-2xl text-sm"
                >
                  Save Photo
                </Button>
              )}
            </div>
          </div>

          {/* Edit form */}
          <div className="flex-1">
            <div className="rouned-2xl rounded-xl p-2 flex justify-end gap-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="rounded-2xl text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="rounded-2xl text-sm"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="rounded-2xl text-sm"
                >
                  <p>Edit Profile</p>
                  <Pen size={18} />
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                {isEditing ? (
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                ) : (
                  <h1 className="font-bold text-2xl md:text-3xl">{form.name}</h1>
                )}
                {isEditing ? (
                  <Input
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-sm md:text-base text-gray-500">{form.specialization}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white flex items-start gap-3 px-4 py-2 rounded-lg shadow-sm">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100 rounded-full shrink-0">
                    <MapPin className="text-slate-600" size={18} />
                  </div>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  ) : (
                    <h1 className="text-sm md:text-base text-gray-700 flex-1 break-words">
                      {form.address}
                    </h1>
                  )}
                </div>

                <div className="bg-white flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100 rounded-full shrink-0">
                    <Phone className="text-slate-600" size={18} />
                  </div>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <h1 className="text-sm md:text-base text-gray-700 flex-1 break-words">
                      {form.phone}
                    </h1>
                  )}
                </div>

                <div className="bg-white flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100 rounded-full shrink-0">
                    <Mail className="text-slate-600" size={18} />
                  </div>
                  {isEditing ? (
                    <Input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <h1 className="text-sm md:text-base text-gray-700 flex-1 break-words">
                      {form.email}
                    </h1>
                  )}
                </div>

                <div className="bg-white flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm">
                  <IndianRupee className="text-green-600 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  {isEditing ? (
                    <Input
                      name="fees"
                      value={form.fees}
                      onChange={handleChange}
                    />
                  ) : (
                    <h1 className="text-sm md:text-base text-gray-700">
                      {form.fees}
                    </h1>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Consultation Overview Section ---------------- */}
        <div className="bg-white rounded-lg shadow-xl flex p-5 flex-col gap-7">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="text-blue-700 " size={24} />
            <h1 className="font-bold text-2xl md:text-3xl">
              Consultation Overview Earning
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border p-3 flex flex-col gap-3"
              >
                <h1 className="font-bold text-sm md:text-base">{stat.label}</h1>
                <h1 className="font-bold text-2xl md:text-4xl">{stat.count}</h1>
                <div className="flex text-slate-500 items-center gap-1">
                  <IndianRupee size={16} />
                  <p className="text-sm md:text-base">{stat.earning}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-5 w-full">
<div className="w-full  lg:w-2/3  p-5 rounded-lg flex flex-col gap-3">
  <h2 className=" font-bold text-xl">Today's Summary</h2>
  <p className=" text-sm">
    Here’s a quick overview of your work today. Stay informed and keep track of your consultations.
  </p>
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-white rounded-lg p-3 flex flex-col items-center">
      <h3 className="font-bold text-lg">{todaysConsultations.length}</h3>
      <p className="text-sm text-gray-600">Consultations</p>
    </div>
    <div className="bg-white rounded-lg p-3 flex flex-col items-center">
      <h3 className="font-bold text-lg">
        <IndianRupee size={16} /> {calcEarnings(todaysConsultations)}
      </h3>
      <p className="text-sm text-gray-600">Earnings</p>
    </div>
  </div>
  <p className=" text-xs mt-3">
    Keep your schedule updated for a smooth workflow. You can view all appointments or change your schedule using the Quick Actions panel.
  </p>
</div>
            <div className="rounded-lg border border-slate-300 w-full lg:w-1/3 flex flex-col p-4 gap-4">
              <h1 className="font-semibold">Quick Actions</h1>
              <Button
                variant="outline"
                className="bg-blue-600 h-12 cursor-pointer text-white text-sm md:text-base"
              >
                View All Appointment
              </Button>
              <Button
                variant="outline"
                className="h-12 text-blue-600 border-2 border-blue-600 text-sm md:text-base"
              >
                Change Schedule
              </Button>
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------------- */}
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/3 flex flex-col gap-7">
        {/* Education */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-3">
          <p className="text-sm text-slate-500">Education</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Avatar>
              <AvatarImage src="/doctorsonlineLogo.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              {isEditing ? (
                <>
                  <Input
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                  />
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <h1 className="font-bold text-xl md:text-3xl">{form.college}</h1>
                  <p className="text-sm md:text-base">{form.state}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Experience + Qualification */}
        <div className="flex flex-col md:flex-row justify-center gap-3">
          <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col gap-3 w-full md:w-1/2">
            <p className="text-sm text-slate-500">Experience</p>
            <div className="flex gap-4 flex-wrap">
              {isEditing ? (
                <Input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                />
              ) : (
                <h1 className="font-bold text-2xl md:text-4xl">{form.experience}</h1>
              )}
              <p className="text-xs md:text-sm">Years Of Experience since 2001</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col gap-3 w-full md:w-1/2">
            <p className="text-sm text-slate-500">Education & Qualifications</p>
            <div className="flex gap-4 flex-wrap">
              {isEditing ? (
                <Input
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                />
              ) : (
                <h1 className="font-bold text-xl md:text-2xl">{form.qualification}</h1>
              )}
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-3">
          <p className="text-slate-700 text-md">Overall Ratings </p>
          <div className="flex gap-5 md:gap-9 flex-wrap md:flex-nowrap">
            <h1 className="font-bold text-2xl md:text-4xl">{user?.overAllRating || 0} </h1>
            <div className="flex flex-col gap-2">
              <RatingStars rating={user?.overAllRating || 0} />
              <p className="text-xs md:text-sm">based on {user?.reviews?.length} reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl p-5 ">
          <div className="flex flex-col gap-3">
            {user?.reviews?.map((review) => (
              <div key={review?._id} className="mb-4">
                <div className="flex flex-col sm:flex-row justify-between">
                  <p className="font-bold">{review?.name || "Karan"}</p>
                  <p className="text-slate-500 text-xs md:text-sm">
                    {review?.createdAt?.split("T")[0]}
                  </p>
                </div>

                <RatingStars rating={user?.overAllRating || 0} />
                <h1 className="text-sm md:text-base">{review?.feedback}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsProfile;
