"use client"

import useGetAllDoctors from '@/hooks/admin/useGetAllDoctors';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const RecentDoctors = () => {
  const router = useRouter();
 

  useGetAllDoctors();
  const {allDoctors} = useSelector((store) => store.admin)
  console.log("All The Doctors ",allDoctors)

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recently Joined Doctors</h2>
        <button onClick={() => router.push("/admin/doctors")} className="text-sm text-[#4d91ff] hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {allDoctors?.map((doctor) => (
          <div
            key={doctor?._id}
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0">
              <img
                src={doctor?.profilePhoto}
                alt={doctor?.fullName}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">{doctor?.fullName}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctor.status === 'Verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {doctor?.doctorsProfile?.verifiedDoctor === true ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <AlertCircle size={12} className="mr-1" />
                  )}
                  {doctor?.doctorsProfile?.verifiedDoctor ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <p className="text-xs text-gray-500">{doctor?.doctorsProfile?.specializations}</p>
              <p className="text-xs text-gray-500">Joined: {doctor?.createdAt.split("T")[0]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDoctors;
