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

// helper to map date -> weekday string like "Monday"
const getDayName = (date) =>
  date.toLocaleDateString("en-US", { weekday: "long" });

const HeroDoctorInside = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  useGetDoctorProfile(id);
  useGetAllAvailableSlots(id);

  const { selectedDoctor,existingAppointment } = useSelector((store) => store.auth);
  useEffect(() => {
  if (existingAppointment) {
    (async () => {
      try {
        const res = await axios.post('/api/patient/getUnpaidAppointments', 
           {appointmentId: existingAppointment },
          {withCredentials: true},
        );

        if (res.data.success) {
          toast.success("You have an existing unpaid appointment. Redirecting to payment page.");
          router.push(`/patient/confirmBooking/${res.data.id}`);
        } else {
          console.log(res.data.message);
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

  // Next 7 days
  const availableDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, [today]);

  // Format for header
  const formatDateDisplay = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

  // Is date selectable
  const isDateSelectable = (date) =>
    availableDates.some((d) => d.toDateString() === date.toDateString());

  // Find slots for the currently selected date’s day name
  const currentDayName = getDayName(selectedDate);
  const currentDaySlots =
    allAvailableSlots.find((slotObj) => slotObj.day === currentDayName)
      ?.slots || [];

  // ---- Submit Handler ----

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
      console.log(body);

      const res = await axios.post(`/api/patient/bookAppointment/${id}`, body, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        console.log(res.data.newAppointment?._id);
        dispatch(setExistingAppointment(res.data.newAppointment?._id));
        router.push(`/patient/confirmBooking/${res.data.newAppointment?._id}`); // redirect to appointments page maybe
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(res.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12">
      {/* Top Section */}
      <div className="w-full flex flex-col lg:flex-row justify-center mt-10 gap-8">
        {/* Doctor Image */}
        <div className="w-full lg:w-1/3 flex justify-center items-center">
          <Image
            height={600}
            width={400}
            alt="Doctor's photo"
            className="rounded-3xl object-cover w-full h-auto max-w-sm"
            src={selectedDoctor?.profilePhoto}
          />
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col w-full lg:w-2/3 gap-6">
          <h1 className="font-bold text-2xl">{selectedDoctor?.fullName}</h1>
          <p className="text-lg text-gray-700">
            {selectedDoctor?.doctorsProfile?.qualifications?.join(", ")}
          </p>
          <p className="pb-3 border-b-2 border-dashed border-gray-400">
            Speciality in{" "}
            <span className="font-medium">
              {selectedDoctor?.doctorsProfile?.specializations}
            </span>
          </p>
          <p className="text-gray-600 text-lg">Working At</p>
          <h1 className="text-lg font-medium">
            {selectedDoctor?.doctorsProfile?.clinic?.[0]?.clinicName},{" "}
            {selectedDoctor?.doctorsProfile?.clinic?.[0]?.city}
          </h1>
          <h1 className="font-bold text-xl">
            Consultation Fees: ₹
            {selectedDoctor?.doctorsProfile?.consultationFees}
          </h1>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full flex justify-center mt-10">
        <div className="w-full lg:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white p-6 rounded-xl gap-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-600 font-medium">Total Experience</h1>
            <h1 className="font-bold text-xl">{selectedDoctor?.doctorsProfile?.experience}+ Years</h1>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-gray-600 font-medium">Contact Details</h1>
            <h1 className="font-bold text-xl">{selectedDoctor?.contactDetails}</h1>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-gray-600 font-medium">Rating</h1>
            <h1 className="font-bold text-xl">4.8 / 5</h1>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-gray-600 font-medium">Languages</h1>
            <h1 className="font-bold text-xl">English, Hindi</h1>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-6 p-4 lg:p-6 xl:p-10">
        {/* Calendar Section */}
        <div className="flex w-full lg:w-2/3 flex-col gap-5 justify-center items-center">
          <h1 className="font-bold text-lg lg:text-xl">Choose a Date</h1>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date && isDateSelectable(date)) {
                setSelectedDate(date);
                setSelectedSlot(null); // reset slot on date change
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
        <div className="flex w-full lg:w-1/3 flex-col gap-4 lg:pl-6">
          <h2 className="font-semibold text-lg lg:text-xl text-center lg:text-left">
            {formatDateDisplay(selectedDate)}
          </h2>

          {currentDaySlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              {currentDaySlots
  .filter((s) => {
    if (s.isBooked) return false;

    // If the selected date is today, remove past slots
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

    return true; // for future dates, keep all slots
  })
  .map((slot, idx) => (
    <Badge
      key={idx}
      onClick={() => setSelectedSlot(slot)}
      className={`w-full h-10 cursor-pointer flex items-center justify-center text-sm lg:text-base font-medium transition-colors
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
            <p className="text-gray-500 text-center mt-4">
              No slots available for {currentDayName}
            </p>
          )}
        </div>
      </div>

      {/* Message box */}
      <div className="flex justify-center">
        <div className="flex flex-col w-2/3 justify-center gap-5">
          <h1 className="font-bold">Message For The Doctor</h1>
          <Textarea
            className="bg-white h-30"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center w-full mt-6">
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
            className="text-white h-10 rounded-2xl w-[70%] sm:w-[50%] md:w-[40%] lg:w-[30%] bg-[#4d91ff] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedSlot}
            onClick={handleBookAppointment}
          >
            BOOK APPOINTMENT NOW
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeroDoctorInside;
