"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import useGetDoctorProfile from "@/hooks/doctors/useGetDoctorProfile";
import useGetAllAvailableSlots from "@/hooks/patients/useGetAllAvailableSlots";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { setExistingAppointment } from "@/redux/authSlice";

const getDayName = (date) =>
  date.toLocaleDateString("en-US", { weekday: "long" });

const HeroDoctorInside = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  useGetDoctorProfile(id);
  useGetAllAvailableSlots(id);

  const { selectedDoctor, existingAppointment } = useSelector(
    (store) => store.auth
  );

  useEffect(() => {
    if (existingAppointment) {
      (async () => {
        try {
          const res = await axios.post(
            "/api/patient/getUnpaidAppointments",
            { appointmentId: existingAppointment },
            { withCredentials: true }
          );

          if (res.data.success) {
            toast.success(
              "You have an existing unpaid appointment. Redirecting to payment page."
            );
            router.push(`/patient/confirmBooking/${res.data.id}`);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [existingAppointment, router]);

  const { allAvailableSlots } = useSelector((store) => store.schedule);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");

  const today = new Date();

  const availableDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, [today]);

  const formatDateDisplay = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

  const isDateSelectable = (date) =>
    availableDates.some((d) => d.toDateString() === date.toDateString());

  const currentDayName = getDayName(selectedDate);
  const currentDaySlots =
    allAvailableSlots.find((slotObj) => slotObj.day === currentDayName)
      ?.slots || [];

  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      const body = {
        message,
        appointmentDate: selectedDate,
        appointmentDay: currentDayName,
        bookedSlot: selectedSlot,
        consultationFees: selectedDoctor?.doctorsProfile?.consultationFees,
      };

      const res = await axios.post(
        `/api/patient/bookAppointment/${id}`,
        body,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setExistingAppointment(res.data.newAppointment?._id));
        router.push(
          `/patient/confirmBooking/${res.data.newAppointment?._id}`
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12">
      {/* Top Section */}
      <div className="w-full flex flex-col lg:flex-row justify-center mt-10 gap-8">
        {/* Doctor Image */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="w-full max-w-sm">
            <Image
              height={400}
              width={300}
              alt="Doctor's photo"
              className="rounded-3xl object-contain w-full max-h-[400px]"
              src={selectedDoctor?.profilePhoto}
            />
          </div>
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col w-full lg:w-2/3 gap-6">
          <h1 className="font-bold text-4xl">Dr.{selectedDoctor?.fullName}</h1>
          <p className="text-lg text-gray-700">
            {selectedDoctor?.doctorsProfile?.qualifications?.join(", ")}
          </p>
          <p className="border-b-2 pb-6 border-dashed border-gray-400">
            Speciality in{" "}
            <span className="font-medium">
              {selectedDoctor?.doctorsProfile?.specializations}
            </span>
          </p>
          <p className="text-gray-600 text-lg">Working At</p>
          <h1 className="text-lg font-medium border-b-2 border-dashed border-gray-400 pb-6">
            {selectedDoctor?.doctorsProfile?.clinic?.[0]?.clinicName},{" "}
            {selectedDoctor?.doctorsProfile?.clinic?.[0]?.city}
          </h1>
          <h1 className="font-bold text-2xl">
            Consultation Fees:{" "}
            <span className="text-[#4d91ff] ml-3">
              ₹{selectedDoctor?.doctorsProfile?.consultationFees}{" "}
              <span className="font-semibold"> per consultation</span>
            </span>
          </h1>
        </div>
      </div>

    {/* Stats Section */}
<div className="w-full flex justify-center mt-10">
  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#F7FAFB] p-6 rounded-xl shadow-sm">
    
    {/* Total Experience */}
    <div className="flex flex-col gap-2 px-6 lg:border-r lg:border-dotted lg:border-slate-700">
      <h1 className="text-gray-600 font-medium">Total Experience</h1>
      <h1 className="font-bold text-xl">
        {selectedDoctor?.doctorsProfile?.experience}+ Years
      </h1>
    </div>

    {/* Contact Details */}
    <div className="flex flex-col gap-2 px-6 lg:border-r lg:border-dotted lg:border-slate-700">
      <h1 className="text-gray-600 font-medium">Contact Details</h1>
      <h1 className="font-bold text-xl">{selectedDoctor?.contactDetails}</h1>
    </div>

    {/* Rating */}
    <div className="flex flex-col gap-2 px-6 lg:border-r lg:border-dotted lg:border-slate-700">
      <h1 className="text-gray-600 font-medium">Rating</h1>
<h1 className="font-bold text-xl">
  {selectedDoctor?.overAllRating
    ? `${selectedDoctor.overAllRating} / 5`
    : "No ratings yet"}
</h1>
    </div>

    {/* Languages */}
    <div className="flex flex-col gap-2 px-6">
      <h1 className="text-gray-600 font-medium">Languages</h1>
      <h1 className="font-bold text-xl">English, Hindi</h1>
    </div>
  </div>
</div>


      {/* Booking Section */}
      <div className="w-full flex flex-col gap-5 lg:flex-row justify-center items-start  p-4 lg:p-6 xl:p-10">
        {/* Calendar Section */}
        <div className="flex w-full  lg:w-1/2 flex-col gap-5 justify-center items-center">
          <h1 className="font-bold text-lg lg:text-xl">Choose a Date</h1>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date && isDateSelectable(date)) {
                setSelectedDate(date);
                setSelectedSlot(null);
              }
            }}
            disabled={(date) => !isDateSelectable(date)}
            modifiers={{ available: availableDates }}
            modifiersStyles={{
              available: {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                fontWeight: "bold",
              },
            }}
            className="rounded-lg border shadow-sm w-full max-w-[500px]"
          />

          <div className="lg:hidden text-sm text-gray-600 text-center px-4">
            Available for booking: Next 7 days
          </div>
        </div>

        {/* Slots Section */}
    {/* Slots Section */}
<div className="flex w-full lg:w-1/3 flex-col gap-4 lg:pl-6">
  <h2 className="font-semibold text-lg lg:cursor-pointer lg:text-xl text-center lg:text-center">
    {formatDateDisplay(selectedDate)}
  </h2>

  {currentDaySlots.length > 0 ? (
    <div className="flex-1 max-h-[500px] overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
      {currentDaySlots
        .filter((s) => {
          if (s.isBooked) return false;
          const isToday =
            selectedDate.toDateString() === new Date().toDateString();
          if (isToday) {
            const now = new Date();
            const [slotHour, slotMinute] = s.startTime.split(":").map(Number);
            const slotDateTime = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              slotHour,
              slotMinute
            );
            return slotDateTime > now;
          }
          return true;
        })
        .map((slot, idx) => (
          <Badge
            key={idx}
            onClick={() => setSelectedSlot(slot)}
            className={`w-full h-16 cursor-pointer flex items-center justify-center text-sm lg:text-base font-medium transition-colors
            ${
              selectedSlot?._id === slot._id
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 hover:bg-blue-50"
            }`}
            variant="outline"
          >
            {slot.startTime} - {slot.endTime}
          </Badge>
        ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
  <p className="text-base font-semibold text-yellow-700">
    No slots available for {currentDayName}
  </p>
  <p className="text-sm text-gray-600 mt-1">
    Please try selecting another date to book your appointment.
  </p>
</div>

  )}
</div>

      </div>

      {/* Message box */}
      <div className="flex justify-center">
        <div className="flex flex-col w-full sm:w-3/4 lg:w-2/3 justify-center gap-5">
          <h1 className="font-bold">Message For The Doctor</h1>
          <Textarea
            className="bg-white h-30"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center pb-10 w-full mt-6">
        {loading ? (
          <Button
            className="text-white h-10 rounded-2xl w-[70%] sm:w-[50%] md:w-[40%] lg:w-[30%] bg-[#4d91ff]"
            disabled
          >
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Please Wait ...
          </Button>
        ) : (
          <Button
            className="text-white h-10 cursor-pointer rounded-2xl w-[70%] sm:w-[50%] md:w-[40%] lg:w-[30%] bg-[#4d91ff] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedSlot}
            onClick={handleBookAppointment}
            variant = "outline"
          >
            BOOK APPOINTMENT NOW
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeroDoctorInside;
