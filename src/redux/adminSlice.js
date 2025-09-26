import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name : "admin",
    initialState : {
        admin : null,
        dashboardCount : {},
        allDoctors : [],
        allPatients : [],
        unverifiedDoctors : [],
        adminAllAppointments : [],
        blockedUsers : [],
        allFeedbacks : [],
        allQueries : [],
        allDoctorsFinances : []

    },
    reducers : {
        setAdmin : (state,action) => {
            state.admin = action.payload
        },
        setDashboardCount : (state,action) => {
            state.dashboardCount = action.payload
        },
        setAllDoctors : (state,action) => {
            state.allDoctors = action.payload
        },
        setAllPatients : (state,action) => {
            state.allPatients = action.payload
        },
        setUnverifiedDoctors : (state,action) => {
            state.unverifiedDoctors = action.payload
        },
        setAdminAllAppointments : (state,action) => {
            state.adminAllAppointments = action.payload
        },
        setBlockedUsers : (state,action) => {
            state.blockedUsers = action.payload
        },
        setAllFeedback : (state,action) => {
            state.allFeedbacks = action.payload
        },
        setAllQueries : (state,action) => {
            state.allQueries = action.payload
        },
        setAllDoctorsFinances : (state,action) => {
            state.allDoctorsFinances = action.payload
        }
       
        
    }
})

// Export actions
export const { setAdmin,setDashboardCount,setAllDoctors,setAllPatients,setUnverifiedDoctors,setAdminAllAppointments,setBlockedUsers ,setAllFeedback,setAllQueries,setAllDoctorsFinances} = adminSlice.actions

// Export reducer
export default adminSlice.reducer
