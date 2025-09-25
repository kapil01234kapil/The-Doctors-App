"use client"

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SetStandardHours = () => {
  const [schedule, setSchedule] = useState({
    Sunday: { isOpen: false, start: '09:00', end: '17:00' },
    Monday: { isOpen: true, start: '09:00', end: '17:00' },
    Tuesday: { isOpen: true, start: '09:00', end: '17:00' },
    Wednesday: { isOpen: true, start: '09:00', end: '17:00' },
    Thursday: { isOpen: true, start: '09:00', end: '17:00' },
    Friday: { isOpen: true, start: '09:00', end: '17:00' },
    Saturday: { isOpen: false, start: '09:00', end: '17:00' }
  });

  // Generate 24-hour time options (HH:mm, every 30 minutes)
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const updateTime = (day, timeType, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [timeType]: value }
    }));
  };

  const handleSave = async () => {
    try {
      // 🔹 Transform schedule into your backend model format
      const weeklySchedule = Object.entries(schedule).map(([day, { isOpen, start, end }]) => ({
        day,
        isActive: isOpen,
        slots: isOpen
          ? [{ startTime: start, endTime: end, isBooked: false }]
          : [],
        slotDuration: 30 // fixed 30 mins everywhere
      }));

      console.log("Final payload →", weeklySchedule);

      const res = await axios.post(
        "/api/doctor/updateWeeklySchedule",
        { weeklySchedule },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const TimeSelect = ({ value, onChange, disabled }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          appearance-none w-full px-3 py-2.5 pr-8 rounded-md border text-sm
          ${disabled 
            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }
          transition-colors duration-200
        `}
      >
        {timeOptions.map(time => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
      <ChevronDown className={`
        absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none 
        ${disabled ? 'text-gray-300' : 'text-gray-500'}
      `} />
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Set Standard Hours
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Configure the standard hours of operation for this Week.
          </p>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          {Object.entries(schedule).map(([day, daySchedule]) => (
            <div key={day} className="border border-gray-200 rounded-lg p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Day and Toggle */}
                <div className="flex items-center justify-between sm:justify-start sm:w-32 lg:w-40">
                  <span className="text-sm sm:text-base font-medium text-gray-900 min-w-0">
                    {day}
                  </span>
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={daySchedule.isOpen}
                      onCheckedChange={() => toggleDay(day)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className={`text-sm ${
                      daySchedule.isOpen ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {daySchedule.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                {/* Time Selectors */}
                {daySchedule.isOpen && (
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <div className="flex-1 min-w-0">
                      <TimeSelect
                        value={daySchedule.start}
                        onChange={(value) => updateTime(day, 'start', value)}
                        disabled={!daySchedule.isOpen}
                      />
                    </div>
                    <span className="text-sm text-gray-500 px-1">TO</span>
                    <div className="flex-1 min-w-0">
                      <TimeSelect
                        value={daySchedule.end}
                        onChange={(value) => updateTime(day, 'end', value)}
                        disabled={!daySchedule.isOpen}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto order-2 sm:order-1 px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 px-6"
          >
            Save Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetStandardHours;
