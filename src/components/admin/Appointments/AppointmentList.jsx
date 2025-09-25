'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import useGetAllAppointments from '@/hooks/admin/useGetAllAppointments';
import { useSelector } from 'react-redux';

const AppointmentsList = () => {
  useGetAllAppointments()
  const {adminAllAppointments} = useSelector((store) => store.admin)
  // const [appointments, setAppointments] = useState([
  //   {
  //     id: 'APT-1234',
  //     patient: { name: 'Rahul Sharma', id: 'PAT-2001', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
  //     doctor: { name: 'Dr. Priya Patel', id: 'DOC-1001', specialization: 'Cardiologist', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  //     date: '2023-10-15',
  //     time: '10:30 AM',
  //     status: 'Completed',
  //     payment: 'Paid',
  //     amount: '₹500'
  //   },
  //   {
  //     id: 'APT-1235',
  //     patient: { name: 'Ananya Singh', id: 'PAT-2002', image: 'https://randomuser.me/api/portraits/women/12.jpg' },
  //     doctor: { name: 'Dr. Vikram Desai', id: 'DOC-1002', specialization: 'Neurologist', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  //     date: '2023-10-15',
  //     time: '11:45 AM',
  //     status: 'Cancelled',
  //     payment: 'Refunded',
  //     amount: '₹500'
  //   },
  //   {
  //     id: 'APT-1236',
  //     patient: { name: 'Amit Kumar', id: 'PAT-2003', image: 'https://randomuser.me/api/portraits/men/13.jpg' },
  //     doctor: { name: 'Dr. Neha Gupta', id: 'DOC-1003', specialization: 'Dermatologist', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  //     date: '2023-10-15',
  //     time: '2:15 PM',
  //     status: 'Upcoming',
  //     payment: 'Paid',
  //     amount: '₹500'
  //   },
  //   {
  //     id: 'APT-1237',
  //     patient: { name: 'Priya Mehta', id: 'PAT-2004', image: 'https://randomuser.me/api/portraits/women/14.jpg' },
  //     doctor: { name: 'Dr. Rajesh Khanna', id: 'DOC-1004', specialization: 'Pediatrician', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
  //     date: '2023-10-16',
  //     time: '9:00 AM',
  //     status: 'Upcoming',
  //     payment: 'Pending',
  //     amount: '₹500'
  //   },
  //   {
  //     id: 'APT-1238',
  //     patient: { name: 'Rajiv Kapoor', id: 'PAT-2005', image: 'https://randomuser.me/api/portraits/men/15.jpg' },
  //     doctor: { name: 'Dr. Ananya Singh', id: 'DOC-1005', specialization: 'Gynecologist', image: 'https://randomuser.me/api/portraits/women/90.jpg' },
  //     date: '2023-10-16',
  //     time: '11:30 AM',
  //     status: 'Upcoming',
  //     payment: 'Paid',
  //     amount: '₹500'
  //   },
  //   {
  //     id: 'APT-1239',
  //     patient: { name: 'Meera Reddy', id: 'PAT-2006', image: 'https://randomuser.me/api/portraits/women/16.jpg' },
  //     doctor: { name: 'Dr. Sanjay Mehta', id: 'DOC-1006', specialization: 'Orthopedic', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  //     date: '2023-10-16',
  //     time: '3:45 PM',
  //     status: 'Upcoming',
  //     payment: 'Paid',
  //     amount: '₹500'
  //   }
  // ]);

  const [showDropdown, setShowDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 5;

  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const filteredAppointments = statusFilter === 'all'
    ? adminAllAppointments
    : adminAllAppointments.filter(appointment => appointment.status.toLowerCase() === statusFilter);

  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

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

  const getPaymentClass = (payment) => {
    switch (payment) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent">
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentAppointments.map((appointment) => (
                <tr key={appointment?._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment._id}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={appointment?.patient?.profilePhoto}
                          alt={appointment?.patient?.fullName}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{appointment?.patient?.fullName}</div>
                        <div className="text-xs text-gray-500">{appointment?.patient?._id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={appointment?.doctor?.profilePhoto}
                          alt={appointment?.doctor?.fullName}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{appointment?.doctor?.fullName}</div>
                        <div className="text-xs text-gray-500">{appointment?.doctor?.doctorsProfile?.specializations}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment?.appointmentDate?.split("T")[0]}</div>
                    <div className="text-xs text-gray-500">{appointment?.bookedSlot}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                        appointment?.status
                      )}`}
                    >
                      {getStatusIcon(appointment?.status)}
                      <span className="ml-1">{appointment?.status}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentClass(
                          appointment?.paymentStatus
                        )}`}
                      >
                        {appointment?.paymentStatus}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{appointment?.consultationFees}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <button
                      onClick={() => toggleDropdown(appointment._id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {showDropdown === appointment._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <Eye size={16} className="mr-2" />
                            View Details
                          </button>
                          {appointment.status === 'Upcoming' && (
                            <>
                              <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                                <XCircle size={16} className="mr-2" />
                                Cancel Appointment
                              </button>
                              <button className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left">
                                <Clock size={16} className="mr-2" />
                                Reschedule
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{indexOfFirstAppointment + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastAppointment > filteredAppointments.length
                ? filteredAppointments.length
                : indexOfLastAppointment}
            </span>{' '}
            of <span className="font-medium">{filteredAppointments.length}</span> appointments
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsList;
