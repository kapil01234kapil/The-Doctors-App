"use client";

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Revenue = () => {
  const [dateRange, setDateRange] = useState('monthly');
  const [currentPeriod, setCurrentPeriod] = useState('October 2023');

  const monthlyData = [
    { day: '01', revenue: 5000, appointments: 50, adminFee: 500 },
    { day: '02', revenue: 6200, appointments: 62, adminFee: 620 },
    { day: '03', revenue: 5800, appointments: 58, adminFee: 580 },
    { day: '04', revenue: 7000, appointments: 70, adminFee: 700 },
    { day: '05', revenue: 6500, appointments: 65, adminFee: 650 },
    { day: '06', revenue: 5500, appointments: 55, adminFee: 550 },
    { day: '07', revenue: 4800, appointments: 48, adminFee: 480 },
    { day: '08', revenue: 7200, appointments: 72, adminFee: 720 },
    { day: '09', revenue: 6800, appointments: 68, adminFee: 680 },
    { day: '10', revenue: 7500, appointments: 75, adminFee: 750 },
    { day: '11', revenue: 8000, appointments: 80, adminFee: 800 },
    { day: '12', revenue: 7800, appointments: 78, adminFee: 780 },
    { day: '13', revenue: 6900, appointments: 69, adminFee: 690 },
    { day: '14', revenue: 6300, appointments: 63, adminFee: 630 },
    { day: '15', revenue: 7100, appointments: 71, adminFee: 710 },
    { day: '16', revenue: 7300, appointments: 73, adminFee: 730 },
    { day: '17', revenue: 6700, appointments: 67, adminFee: 670 },
    { day: '18', revenue: 6100, appointments: 61, adminFee: 610 },
    { day: '19', revenue: 5900, appointments: 59, adminFee: 590 },
    { day: '20', revenue: 6400, appointments: 64, adminFee: 640 },
    { day: '21', revenue: 7400, appointments: 74, adminFee: 740 },
    { day: '22', revenue: 8200, appointments: 82, adminFee: 820 },
    { day: '23', revenue: 7900, appointments: 79, adminFee: 790 },
    { day: '24', revenue: 7600, appointments: 76, adminFee: 760 },
    { day: '25', revenue: 7200, appointments: 72, adminFee: 720 },
    { day: '26', revenue: 6600, appointments: 66, adminFee: 660 },
    { day: '27', revenue: 6000, appointments: 60, adminFee: 600 },
    { day: '28', revenue: 5700, appointments: 57, adminFee: 570 },
    { day: '29', revenue: 6300, appointments: 63, adminFee: 630 },
    { day: '30', revenue: 7000, appointments: 70, adminFee: 700 },
    { day: '31', revenue: 7500, appointments: 75, adminFee: 750 }
  ];

  const yearlyData = [
    { month: 'Jan', revenue: 180000, appointments: 1800, adminFee: 18000 },
    { month: 'Feb', revenue: 160000, appointments: 1600, adminFee: 16000 },
    { month: 'Mar', revenue: 190000, appointments: 1900, adminFee: 19000 },
    { month: 'Apr', revenue: 170000, appointments: 1700, adminFee: 17000 },
    { month: 'May', revenue: 200000, appointments: 2000, adminFee: 20000 },
    { month: 'Jun', revenue: 210000, appointments: 2100, adminFee: 21000 },
    { month: 'Jul', revenue: 220000, appointments: 2200, adminFee: 22000 },
    { month: 'Aug', revenue: 230000, appointments: 2300, adminFee: 23000 },
    { month: 'Sep', revenue: 240000, appointments: 2400, adminFee: 24000 },
    { month: 'Oct', revenue: 210000, appointments: 2100, adminFee: 21000 },
    { month: 'Nov', revenue: 0, appointments: 0, adminFee: 0 },
    { month: 'Dec', revenue: 0, appointments: 0, adminFee: 0 }
  ];

  const topDoctors = [
    {
      id: 'DOC-1001',
      name: 'Dr. Priya Patel',
      specialization: 'Cardiologist',
      appointments: 120,
      revenue: 12000,
      adminFee: 1200,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 'DOC-1003',
      name: 'Dr. Neha Gupta',
      specialization: 'Dermatologist',
      appointments: 110,
      revenue: 11000,
      adminFee: 1100,
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: 'DOC-1005',
      name: 'Dr. Ananya Singh',
      specialization: 'Gynecologist',
      appointments: 105,
      revenue: 10500,
      adminFee: 1050,
      image: 'https://randomuser.me/api/portraits/women/90.jpg'
    },
    {
      id: 'DOC-1006',
      name: 'Dr. Sanjay Mehta',
      specialization: 'Orthopedic',
      appointments: 98,
      revenue: 9800,
      adminFee: 980,
      image: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      id: 'DOC-1002',
      name: 'Dr. Vikram Desai',
      specialization: 'Neurologist',
      appointments: 92,
      revenue: 9200,
      adminFee: 920,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  ];

  const recentTransactions = [
    {
      id: 'TRX-1001',
      doctor: 'Dr. Priya Patel',
      date: '2023-10-15',
      appointments: 5,
      amount: '₹500',
      status: 'Completed'
    },
    {
      id: 'TRX-1002',
      doctor: 'Dr. Vikram Desai',
      date: '2023-10-15',
      appointments: 3,
      amount: '₹300',
      status: 'Completed'
    },
    {
      id: 'TRX-1003',
      doctor: 'Dr. Neha Gupta',
      date: '2023-10-14',
      appointments: 4,
      amount: '₹400',
      status: 'Completed'
    },
    {
      id: 'TRX-1004',
      doctor: 'Dr. Rajesh Khanna',
      date: '2023-10-14',
      appointments: 2,
      amount: '₹200',
      status: 'Pending'
    },
    {
      id: 'TRX-1005',
      doctor: 'Dr. Ananya Singh',
      date: '2023-10-13',
      appointments: 6,
      amount: '₹600',
      status: 'Completed'
    }
  ];

  const chartData = dateRange === 'monthly' ? monthlyData : yearlyData;
  const xAxisKey = dateRange === 'monthly' ? 'day' : 'month';
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalAppointments = chartData.reduce((sum, item) => sum + item.appointments, 0);
  const totalAdminFee = chartData.reduce((sum, item) => sum + item.adminFee, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Revenue Management</h1>

      <div className="bg-white rounded-lg shadow p-4">
        {/* Period selector and export buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className="text-sm text-gray-500">
              Track revenue, appointments, and admin fees
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <div className="flex items-center space-x-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  dateRange === 'monthly'
                    ? 'bg-[#4d91ff] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setDateRange('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  dateRange === 'yearly'
                    ? 'bg-[#4d91ff] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setDateRange('yearly')}
              >
                Yearly
              </button>
            </div>
            <div className="flex items-center border rounded-lg px-3 py-1.5">
              <button className="text-gray-400 hover:text-gray-600 mr-2">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm">{currentPeriod}</span>
              <button className="text-gray-400 hover:text-gray-600 ml-2">
                <ChevronRight size={16} />
              </button>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Calendar size={16} />
              <span className="text-sm">Custom</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Download size={16} />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">+8% from previous period</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-800">
              {totalAppointments.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">+12% from previous period</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Admin Fee Collected</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalAdminFee.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">+8% from previous period</p>
          </div>
        </div>

        {/* Revenue line chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) =>
                  name === 'revenue' || name === 'adminFee'
                    ? [`₹${value}`, name === 'revenue' ? 'Revenue' : 'Admin Fee']
                    : [value, 'Appointments']
                }
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4d91ff" name="Revenue" />
              <Line yAxisId="left" type="monotone" dataKey="adminFee" stroke="#10b981" name="Admin Fee" />
              <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#8884d8" name="Appointments" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performing doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Top Performing Doctors</h2>
            <button className="text-sm text-[#4d91ff] hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topDoctors.map((doctor, index) => (
              <div key={doctor.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-bold text-white bg-[#4d91ff] rounded-full">
                  {index + 1}
                </div>
                <div className="ml-3 flex-shrink-0">
                  <img src={doctor.image} alt={doctor.name} className="w-10 h-10 rounded-full" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                  <p className="text-xs text-gray-500">{doctor.specialization}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{doctor.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doctor.appointments} appointments
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by specialization */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Revenue by Specialization</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs">
                <Filter size={12} />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs">
                <Download size={12} />
                <span>Export</span>
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Cardiology', revenue: 45000 },
                  { name: 'Dermatology', revenue: 38000 },
                  { name: 'Neurology', revenue: 32000 },
                  { name: 'Gynecology', revenue: 30000 },
                  { name: 'Orthopedic', revenue: 28000 },
                  { name: 'Pediatrics', revenue: 25000 },
                  { name: 'Ophthalmology', revenue: 22000 }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="revenue" fill="#4d91ff" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button className="text-sm text-[#4d91ff] hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4d91ff]">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.doctor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.appointments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
