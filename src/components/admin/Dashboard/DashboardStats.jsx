"use client"

import useGetDashboardCount from '@/hooks/admin/useGetDashboardCount';
import { UserRound, Users, CalendarClock, Ban, Share2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const DashboardStats = () => {
  useGetDashboardCount(); // Fetch the latest dashboard count
  const { dashboardCount } = useSelector((store) => store.admin);
  console.log("this is the structure of dashboardCount", dashboardCount);

  // Map the dashboardCount data to stats array dynamically
  const stats = [
    {
      title: 'Total Doctors',
      value: dashboardCount?.totalDoctors || 0,
      icon: <UserRound size={24} className="text-blue-500" />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Patients',
      value: dashboardCount?.totalPatients || 0,
      icon: <Users size={24} className="text-green-500" />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Appointments',
      value: dashboardCount?.totalAppointments || 0,
      icon: <CalendarClock size={24} className="text-purple-500" />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Blocked Users',
      value: dashboardCount?.blockedUser || 0,
      icon: <Ban size={24} className="text-red-500" />,
      bgColor: 'bg-red-50',
    },
    {
      title: 'Referrals',
      value: dashboardCount?.totalReferrals || 0,
      icon: <Share2 size={24} className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} p-4 rounded-lg shadow-sm`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className="p-2 rounded-full bg-white">{stat.icon}</div>
          </div>
          {/* You can remove the change section if you don't have percentage change in dashboardCount */}
          <div className="mt-2">
            <span className="text-xs text-gray-500">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
