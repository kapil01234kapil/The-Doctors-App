import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB()
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({message : "Token is missing",success : false},{status : 401})
        }
        const existingDoctor = await User.findById(userId).select("-password")
        if(!existingDoctor){
            return NextResponse.json({message : "No Such Doctor Found", success : false},{status:404})
        }
        const doctorSchedule = await DoctorWeeklySlot.findOne({doctor : userId})
        if(!doctorSchedule){
            return NextResponse.json({message : "No schedule found for this doctor",success : false},{status : 404})
        }

        return NextResponse.json({message : "WeeklySchedule Found",success : true,weeklySchedule : doctorSchedule},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success : false,message : "Internal Server Error"},{status:500})
        
    }
}