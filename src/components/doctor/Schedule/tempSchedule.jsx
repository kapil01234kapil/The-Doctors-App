"use client"

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const SetStandardHours = () => {
  
  const [schedule, setSchedule] = useState({
    Sunday: { isOpen: false, start: '9:00 AM', end: '5:00 PM' },
    Monday: { isOpen: true, start: '9:00 AM', end: '5:00 PM' },
    Tuesday: { isOpen: true, start: '9:00 AM', end: '5:00 PM' },
    Wednesday: { isOpen: true, start: '9:00 AM', end: '5:00 PM' },
    Thursday: { isOpen: true, start: '9:00 AM', end: '5:00 PM' },
    Friday: { isOpen: true, start: '9:00 AM', end: '5:00 PM' },
    Saturday: { isOpen: false, start: '9:00 AM', end: '5:00 PM' }
  });

  const timeOptions = [
    '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
    '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM',
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
  ];

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
      <ChevronDown className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
        disabled ? 'text-gray-300' : 'text-gray-500'
      }`} />
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