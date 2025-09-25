import HeroReferEarn from '@/components/shared/ReferEarn/HeroReferEarn'
import ReferredDoctorsTable from '@/components/shared/ReferEarn/TableReferEarn'
import React from 'react'

const page = () => {
  return (
    <div>
        <HeroReferEarn/>
        <ReferredDoctorsTable/>
    </div>
  )
}

export default page