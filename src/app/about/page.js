import DoctorInfoCard from '@/components/shared/About/DoctorInfoCard'
import HeroAbout from '@/components/shared/About/HeroAbout'
import OurServicesAbout from '@/components/shared/About/OurServicesAbout'
import TeamCard from '@/components/shared/About/TeamCard'
import DashboardStory from '@/components/shared/Dashboard/DashboardStory'
import React from 'react'

const page = () => {
  return (
    <div>
        <HeroAbout/>
        <DashboardStory/>
        <OurServicesAbout/>
    </div>
  )
}

export default page