"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import Footer from '../shared/Footer'

const PatientWrapper = ({children}) => {
    const {user} = useSelector((store) => store.auth)
  return (
    <div className='min-h-screen flex flex-col justify-between h-full'>
        {children}
        {/* {user?.role !== "doctor" && <Footer/>} */}
    </div>
  )
}

export default PatientWrapper