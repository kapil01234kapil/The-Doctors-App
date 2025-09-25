import Dashboard from '@/components/doctor/DoctorDashboard/Dashboard'
import DoctorLayout from '@/components/doctor/DoctorLayout'
import DoctorNavabr from '@/components/doctor/DoctorNavabr'
import SideBar from '@/components/doctor/SideBar'
import React from 'react'

const page = () => {
  return (
    <div>
               <DoctorLayout>
                <Dashboard/>
               </DoctorLayout>
    </div>
  )
}

export default page