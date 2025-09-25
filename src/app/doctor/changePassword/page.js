import PasswordSecuritySettings from '@/components/doctor/ChangePassword/ChangePasswordDoctor'
import DoctorLayout from '@/components/doctor/DoctorLayout'
import React from 'react'

const page = () => {
  return (
    <div>
               <DoctorLayout>
<PasswordSecuritySettings/>
               </DoctorLayout>
    </div>
  )
}

export default page