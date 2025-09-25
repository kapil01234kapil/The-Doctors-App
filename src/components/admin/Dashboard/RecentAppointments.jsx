import { CheckCircle, XCircle, Clock } from 'lucide-react';

const RecentAppointments = () => {
  const appointments = [
    {
      id: 'APT-1234',
      patient: 'Rahul Sharma',
      doctor: 'Dr. Priya Patel',
      date: '2023-10-15',
      time: '10:30 AM',
      status: 'Completed',
    },
    {
      id: 'APT-1235',
      patient: 'Ananya Singh',
      doctor: 'Dr. Vikram Desai',
      date: '2023-10-15',
      time: '11:45 AM',
      status: 'Cancelled',
    },
    {
      id: 'APT-1236',
      patient: 'Amit Kumar',
      doctor: 'Dr. Neha Gupta',
      date: '2023-10-15',
      time: '2:15 PM',
      status: 'Upcoming',
    },
    {
      id: 'APT-1237',
      patient: 'Priya Mehta',
      doctor: 'Dr. Rajesh Khanna',
      date: '2023-10-16',
      time: '9:00 AM',
      status: 'Upcoming',
    },
  ];

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
        <button className="text-sm text-[#4d91ff] hover:underline">View All</button>
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
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{appointment.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{appointment.patient}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{appointment.doctor}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {appointment.date} <br />
                  <span className="text-xs text-gray-500">{appointment.time}</span>
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
