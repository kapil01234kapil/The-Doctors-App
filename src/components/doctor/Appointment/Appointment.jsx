"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Plus, Filter } from 'lucide-react';
import useGetAllDoctorsAppointments from '@/hooks/doctors/useGetAllDoctorsAppointments';
import { useSelector } from 'react-redux';

const AppointmentsDashboard = () => {
  useGetAllDoctorsAppointments();
  const { allAppointments } = useSelector((store) => store.auth);
  console.log("All the Appointments", allAppointments);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalAppointments = allAppointments?.length || 0;
  const servedAppointments = allAppointments?.filter(app => app.status === "completed")?.length || 0;
  const pendingAppointments = allAppointments?.filter(app => app.status === "confirmed")?.length || 0;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(); // e.g. 9/2/2025
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">

        {/* Total Appointments */}
        <div className="bg-white cursor-pointer rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Total No of Appointments</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
            {totalAppointments}
          </div>
        </div>

        {/* Appointments Served */}
        <div className="bg-white cursor-pointer rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Appointments Served</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
            {servedAppointments}
          </div>
        </div>

        {/* Appointments Pending */}
        <div className="bg-white cursor-pointer rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Appointments Pending</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">
            {pendingAppointments}
          </div>
        </div>

      </div>

      {/* Appointments Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Appointments</h2>
            {/* <Button size="sm" variant="outline" className="p-1.5 h-auto">
              <Plus className="h-4 w-4" />
            </Button> */}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-blue-50">
              <Filter className="h-4 w-4 mr-2" />
              All
            </Button>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">S.NO</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Age</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Message</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Timing</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Appointment Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments?.map((appointment, index) => {
                const status = appointment.status === "completed" ? "Completed" : 
                               appointment.status === "confirmed" ? "Pending" : "Other";

                return (
                  <tr key={appointment._id} className="border-b border-gray-50 hover:bg-gray-25">
                    <td className="py-4 px-6 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{appointment.patientProfile?.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{appointment.patientProfile?.age}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{appointment.notes}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{appointment.appointmentDay} ({appointment.bookedSlot})</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{formatDate(appointment.appointmentDate)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cards - Mobile & Tablet */}
        <div className="lg:hidden space-y-3 p-4 sm:p-6">
          {allAppointments?.map((appointment, index) => {
            const status = appointment.status === "completed" ? "Completed" : 
                           appointment.status === "confirmed" ? "Pending" : "Other";

            return (
              <div key={appointment._id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-base font-semibold text-gray-900">{appointment.patientProfile?.name}</span>
                    <span className="text-sm text-gray-500">Age {appointment.patientProfile?.age}</span>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                  <p className="text-sm text-gray-500">⏰ {appointment.appointmentDay} ({appointment.bookedSlot})</p>
                  <p className="text-sm text-gray-500">📅 {formatDate(appointment.appointmentDate)}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AppointmentsDashboard;
