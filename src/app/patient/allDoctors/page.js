import HeroSection from '@/components/shared/AllDoctors/HeroSection'
import DoctorsListPage from '@/components/shared/AllDoctors/ListedDoctors'
import MedicalSearchBar from '@/components/shared/AllDoctors/SearchBar'
import Navbar from '@/components/shared/Navbar'
import React from 'react'

const Page = () => {
  return (
    <div
     
    >
      <HeroSection />
      <DoctorsListPage/>
      {/* Future sections will also sit on the same background */}
    </div>
  )
}

export default Page
