import AppointmentsDashboard from '@/components/doctor/Appointment/Appointment'
import Dashboard from '@/components/doctor/DoctorDashboard/Dashboard'
import DoctorLayout from '@/components/doctor/DoctorLayout'
import DoctorNavabr from '@/components/doctor/DoctorNavabr'
import Feedback from '@/components/doctor/Feedback/Feedback'
import GetInTouch from '@/components/doctor/GetInTouch/GetInTouch'
import SetStandardHours from '@/components/doctor/Schedule/Schedule'
import SideBar from '@/components/doctor/SideBar'
import React from 'react'

const page = () => {
  return (
    <div>
               <DoctorLayout>
<GetInTouch/>
               </DoctorLayout>
    </div>
  )
}

export default page