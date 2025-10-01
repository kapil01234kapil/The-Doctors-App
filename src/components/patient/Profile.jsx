"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import {
  Pencil,
  Check,
  X,
  CalendarCheck,
  CalendarX2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import useGetAllPatientsAppointments from "@/hooks/patients/useGetAllPatientAppointments";
import Image from "next/image";

export default function PatientProfilePage() {
  const dispatch = useDispatch();
    useGetAllPatientsAppointments();

  const { user, allAppointments } = useSelector((store) => store.auth);
  console.log("all the appointments",allAppointments)
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  // ✅ Form data
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    contactDetails: user?.contactDetails || "",
    address: user?.address || "",
    age: user?.age || "",
    gender: user?.gender || "",
  });

  // ✅ Appointment analytics (dynamic)
  const appointments = useMemo(() => {
    const now = new Date();
    let upcoming = 0;
    let cancelled = 0;
    let completed = 0;

    allAppointments?.forEach((appt) => {
      if (appt.status === "completed") {
        completed++;
      } else if (appt.status === "cancelled") {
        cancelled++;
      } else if (new Date(appt.appointmentDate) > now) {
        upcoming++;
      }
    });

    return { upcoming, cancelled, completed };
  }, [allAppointments]);

  // 🔹 Still static consultations for now
   const upcomingConsultations = useMemo(() => {
    const now = new Date();
    return allAppointments.filter((appt) => new Date(appt.appointmentDate) > now);
  }, [allAppointments]);

  // ✅ Update profile
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/patient/updateProfile", formData);
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setEditingProfile(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update photo
  const handlePhotoUpdate = async () => {
    if (!photoFile) return;
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("profilePhoto", photoFile);

      const res = await axios.post("/api/patient/updatePhoto", fd);

      if (res.data.success) {
        dispatch(
          setUser({
            ...user,
            profilePhoto: res.data.profilePhoto,
          })
        );
        toast.success(res.data.message);
        setEditingPhoto(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Profile Photo */}
<div className="relative w-32 h-32">
  {/* Rounded container with border */}
  <div className="w-full h-full p-4 rounded-full border-2 border-[#4d91ff] overflow-hidden bg-white">
    <Image
      height={128}
      width={128}
      src={user?.profilePhoto || "/defaultUserImage.jpg"}
      alt="Profile"
      className="w-full h-full object-contain" 
    />
  </div>

  {/* Edit Button */}
  <button
    onClick={() => setEditingPhoto(!editingPhoto)}
    className="absolute bottom-0 right-0 bg-[#4d91ff] p-2 rounded-full text-white shadow"
  >
    <Pencil size={18} />
  </button>
</div>


        {editingPhoto && (
          <div className="flex flex-col items-start gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handlePhotoUpdate}
                disabled={loading}
                className="bg-[#4d91ff] text-white px-4 py-1 rounded-md"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingPhoto(false)}
                className="bg-gray-200 px-4 py-1 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Profile Info */}
        <div className="flex-1">
          {!editingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <p>
                <strong>Name:</strong> {user?.fullName || "NA"}
              </p>
              <p>
                <strong>Phone:</strong> {user?.contactDetails || "NA"}
              </p>
              <p>
                <strong>Address:</strong> {user?.address || "NA"}
              </p>
              <p>
                <strong>Age:</strong> {user?.age || "NA"}
              </p>
              <p>
                <strong>Gender:</strong> {user?.gender || "NA"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="border rounded p-2"
                placeholder="Name"
              />
              <input
                type="text"
                value={formData.contactDetails}
                onChange={(e) =>
                  setFormData({ ...formData, contactDetails: e.target.value })
                }
                className="border rounded p-2"
                placeholder="Phone"
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border rounded p-2"
                placeholder="Address"
              />
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="border rounded p-2"
                placeholder="Age"
              />
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="border rounded p-2"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
          )}

          <div className="mt-3">
            {!editingProfile ? (
              <button
                onClick={() => setEditingProfile(true)}
                className="bg-[#4d91ff] text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Pencil size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="bg-[#4d91ff] text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <Check size={16} /> {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      fullName: user?.fullName || "",
                      contactDetails: user?.contactDetails || "",
                      address: user?.address || "",
                      age: user?.age || "",
                      gender: user?.gender || "",
                    });
                    setEditingProfile(false);
                  }}
                  className="bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#4d91ff] mb-4">
          Appointment Analytics
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Upcoming */}
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition">
            <div className="bg-blue-100 p-4 rounded-full">
              <Calendar className="text-[#4d91ff]" size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Upcoming</p>
              <p className="text-2xl font-bold text-[#4d91ff]">
                {appointments.upcoming}
              </p>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition">
            <div className="bg-red-100 p-4 rounded-full">
              <CalendarX2 className="text-red-500" size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cancelled</p>
              <p className="text-2xl font-bold text-red-500">
                {appointments.cancelled}
              </p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition">
            <div className="bg-green-100 p-4 rounded-full">
              <CalendarCheck className="text-green-500" size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-500">
                {appointments.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Consultations */}
<div className="mt-10">
  <h2 className="text-xl font-semibold text-[#4d91ff] mb-4">
    Upcoming Consultations
  </h2>

  {upcomingConsultations.length === 0 ? (
    <p className="text-gray-500 italic">
      No upcoming consultations at the moment.
    </p>
  ) : (
    <div className="grid gap-6 md:grid-cols-2">
      {upcomingConsultations.map((c) => {
        const dateObj = new Date(c.appointmentDate);
        return (
          <div
            key={c._id}
            className="bg-white shadow rounded-2xl p-6 flex gap-4 items-start hover:shadow-lg transition"
          >
            <img
              src={c.doctor?.profilePhoto || "/default-doctor.png"}
              alt={c.doctor?.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#4d91ff]"
            />
            <div className="flex-1">
              <p className="font-semibold text-lg text-gray-800">
                {c.doctor?.fullName}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                {c.doctor?.doctorsProfile?.specializations ||
                  "Specialization not specified"}
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#4d91ff]" />
                  {c.appointmentDay},{" "}
                  {dateObj.toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-[#4d91ff]" />
                  {c.bookedSlot}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#4d91ff]" />
                  {c.doctor?.doctorsProfile?.clinic?.[0]?.clinicAddress ||
                    "Clinic address not available"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

    </div>
  );
}
