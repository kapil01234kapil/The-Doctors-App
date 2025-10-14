"use client"

import { useSelector } from 'react-redux';
import DashboardStats from './DashboardStats';
import RecentAppointments from './RecentAppointments';
import RecentDoctors from './RecentDoctors';
import RevenueChart from './RevenueChart';

const Dashboard = () => {
  const {dashboardCount} = useSelector((store) => store.admin)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Revenue & Referral Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Referral Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardCount?.totalReferrals || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Successful Referrals</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardCount?.successfullReferrals || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Rewards Distributed</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardCount?.totalAmountCredited || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending Rewards</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardCount?.totalBonusEarned - dashboardCount?.totalAmountCredited}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments & Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppointments />
        <RecentDoctors />
      </div>
    </div>
  );
};

export default Dashboard;
