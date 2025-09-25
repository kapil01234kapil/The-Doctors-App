import { createSlice } from '@reduxjs/toolkit'
import { set } from 'mongoose'

const initialState = {
  user: null,
  loading: false,
  medicalRegistration:null,
  allDoctors : [],
  selectedDoctor : null,
  allAppointments : [],
  referDetails : null,
  existingAppointment : null,
  doctorFinanceRecords : [],
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setMedicalRegistration: (state, action) => {
      state.medicalRegistration = action.payload
    },
    
    setAllDoctors:(state,action) => {
      state.allDoctors = action.payload
    },
    setSelectedDoctor : (state,action)=> {
      state.selectedDoctor = action.payload
    },
    setAllAppointments : (state,action) => {
      state.allAppointments = action.payload
    },
    setReferDetails : (state,action)=> {
      state.referDetails = action.payload
    },
    setExistingAppointment : (state,action) => {
      state.existingAppointment = action.payload;
    },
    setDoctorFinanceRecords : (state,action) => {
      state.doctorFinanceRecords = action.payload;
    }
  },
})

// Export actions
export const { setUser,setLoading,setMedicalRegistration,setAllDoctors,setSelectedDoctor,setAllAppointments,setReferDetails,setExistingAppointment,setDoctorFinanceRecords } = authSlice.actions

// Export reducer
export default authSlice.reducer
