"use client"

import useGetAllAppointments from '@/hooks/admin/useGetAllAppointments';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const RecentAppointments = () => {
  useGetAllAppointments()
  const {adminAllAppointments}  = useSelector((store) => store.admin);
 const router = useRouter()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'Cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'Upcoming':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Appointments</h2>
        <button onClick={() => router.push("/admin/appointments")} className="text-sm text-[#4d91ff] hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              {['ID', 'Patient', 'Doctor', 'Date & Time', 'Status'].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {adminAllAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{appointment._id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{appointment?.patientProfile?.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{appointment?.doctor?.fullName}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {appointment.appointmentDate?.split("T")[0]} <br />
                  <span className="text-xs text-gray-500">{appointment?.bookedSlot}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1">{appointment.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAppointments;
