import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
    name : 'schedule',
    initialState : {
        weeklySchedule : [],
        allAvailableSlots : [],
    },
    reducers : {
        setWeeklySchedule : (state,action) => {
            state.weeklySchedule =  action.payload
        },
        setAllAvailableSlots : (state,action) => {
            state.allAvailableSlots = action.payload
        }
    }
})

export const {setWeeklySchedule,setAllAvailableSlots} = scheduleSlice.actions

export default scheduleSlice.reducer