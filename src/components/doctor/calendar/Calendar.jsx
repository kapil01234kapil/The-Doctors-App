"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import useGetDoctorsWeeklySchedule from "@/hooks/doctors/useGetDoctorsWeeklySchedule";

const WeeklyCalendar = () => {
  useGetDoctorsWeeklySchedule();
  const { weeklySchedule } = useSelector((store) => store.schedule);
  const { allAppointments } = useSelector((store) => store.auth);

  // Format date as yyyy-mm-dd in local timezone
  const formatDateLocal = (dateStr) => {
    const d = new Date(dateStr);
    // Ensure we get the correct date in local timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - dayOfWeek + 1);
    return mondayDate;
  });

  const weekDates = useMemo(() => {
    const dates = [];
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);

      dates.push({
        dayName: dayNames[i],
        date: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        fullDate: date.toLocaleDateString("en-CA"), // yyyy-mm-dd
      });
    }
    return dates;
  }, [currentWeekStart]);

  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newWeekStart);
  };

  // Get all unique time slots from weekly schedule template
  const masterSlots = useMemo(() => {
    if (!weeklySchedule?.allSlot) return [];

    const allSlots = weeklySchedule.allSlot.flatMap((day) =>
      day.slots.map((s) => ({
        label: `${s.startTime}-${s.endTime}`,
        startTime: s.startTime,
      }))
    );

    const unique = Array.from(
      new Map(allSlots.map((s) => [s.label, s])).values()
    );
    unique.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return unique.map((s) => s.label);
  }, [weeklySchedule]);

  // Check if doctor is available for this day/slot based on weekly schedule template
  const isDoctorAvailable = (dayName, slotLabel) => {
    const dayData = weeklySchedule?.allSlot?.find((d) => d.day === dayName);
    if (!dayData) return false;
    
    return dayData.slots.some(
      (s) => `${s.startTime}-${s.endTime}` === slotLabel
    );
  };

  // Get appointment for specific date and time slot
  const getAppointmentForSlot = (fullDate, slotLabel) => {
    if (!allAppointments || allAppointments.length === 0) {
      return null;
    }
    
    return allAppointments.find((appt) => {
      const apptDate = formatDateLocal(appt.appointmentDate);
      const apptSlot = appt.bookedSlot;
      
      // Normalize both slot formats (remove spaces around dash)
      const normalizedApptSlot = apptSlot.replace(/\s*-\s*/g, '-');
      const normalizedSlotLabel = slotLabel.replace(/\s*-\s*/g, '-');
      
      // Match both date and time slot
      return apptDate === fullDate && normalizedApptSlot === normalizedSlotLabel;
    });
  };

  // Get slot status and information for a specific day/date/time
  const getSlotForDay = (dayName, fullDate, slotLabel) => {
    // First, check if there's a real appointment for this specific date/time
    const appointment = getAppointmentForSlot(fullDate, slotLabel);
    
    if (appointment) {
      // There's a booked appointment for this date/time
      return {
        startTime: slotLabel.split("-")[0],
        endTime: slotLabel.split("-")[1],
        isBooked: true,
        patientName: appointment.patientProfile?.name || "Patient",
        appointmentId: appointment._id,
      };
    }

    // Check if doctor is available on this day/time based on weekly template
    const isAvailable = isDoctorAvailable(dayName, slotLabel);
    
    if (!isAvailable) {
      return null; // Doctor not available
    }

    // Doctor is available but no appointment booked
    return {
      startTime: slotLabel.split("-")[0],
      endTime: slotLabel.split("-")[1],
      isBooked: false,
      isAvailable: true,
    };
  };

  const AppointmentCell = ({ slot }) => {
    if (!slot) {
      return (
        <div className="h-full flex items-center justify-center text-gray-400">
          —
        </div>
      );
    }

    if (slot.isBooked) {
      return (
        <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-medium h-full flex items-center justify-center text-center">
          {slot.patientName}
        </div>
      );
    }

    // Available slot
    return (
      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs sm:text-sm font-medium h-full flex items-center justify-center text-center">
        Available
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Weekly Schedule
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium px-4">
            {weekDates[0]?.month} {weekDates[0]?.date} - {weekDates[6]?.month}{" "}
            {weekDates[6]?.date}
          </span>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Debug info - remove this after testing */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
        <div><strong>Debug Info:</strong></div>
        <div>Total appointments: {allAppointments?.length || 0}</div>
        {allAppointments?.slice(0, 3).map((appt, idx) => (
          <div key={idx}>
            Appointment {idx + 1}: {formatDateLocal(appt.appointmentDate)} - "{appt.bookedSlot}" - {appt.patientProfile?.name}
          </div>
        ))}
        <div>Current week dates: {weekDates.map(d => d.fullDate).join(', ')}</div>
        <div>Sample master slots: {masterSlots.slice(0, 3).map(slot => `"${slot}"`).join(', ')}</div>
      </div> */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Not Available</span>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-8 gap-px bg-gray-200 mb-px">
            <div className="bg-gray-50 p-3 font-semibold text-gray-700 text-center">
              Time Slot
            </div>
            {weekDates.map((day, index) => (
              <div key={index} className="bg-gray-50 p-3 text-center">
                <div className="font-semibold text-gray-700 text-sm lg:text-base">
                  {day.dayName}
                </div>
                <div className="text-xs lg:text-sm text-gray-500 mt-1">
                  {day.date} {day.month}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-200 space-y-px">
            {masterSlots.map((slotLabel, timeIndex) => (
              <div key={timeIndex} className="grid grid-cols-8 gap-px">
                <div className="bg-white p-3 flex items-center justify-center">
                  <div className="text-xs lg:text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {slotLabel}
                  </div>
                </div>

                {weekDates.map((day, dayIndex) => {
                  const slot = getSlotForDay(
                    day.dayName,
                    day.fullDate,
                    slotLabel
                  );
                  return (
                    <div key={dayIndex} className="bg-white p-2 min-h-[60px]">
                      <AppointmentCell slot={slot} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {weekDates.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="mb-6 bg-gray-50 rounded-lg overflow-hidden"
          >
            <div className="bg-blue-500 text-white p-4 text-center">
              <div className="font-semibold">{day.dayName}</div>
              <div className="text-sm opacity-90">
                {day.date} {day.month}
              </div>
            </div>

            <div className="p-4 space-y-2">
              {masterSlots.map((slotLabel, timeIndex) => {
                const slot = getSlotForDay(
                  day.dayName,
                  day.fullDate,
                  slotLabel
                );
                return (
                  <div key={timeIndex} className="flex items-center gap-3">
                    <div className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded min-w-[80px] text-center">
                      {slotLabel}
                    </div>
                    <div className="flex-1">
                      <AppointmentCell slot={slot} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;