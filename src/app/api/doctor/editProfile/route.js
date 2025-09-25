import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        await connectDB();
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({message : "Token is Missing",success : false},{status : 401})
        }

        const existingUser = await userModels.findById(userId).select("-password");
        if(!existingUser){
            return NextResponse.json({message : "User Not Found",success : false},{status: 404})
        }

        if(existingUser?.role !== "doctor"){
            return NextResponse.json({message : "You Are Not Allowed To make this change in the schema ",success : false},{status : 401})
        }
        const {name , specialization,address,phone,email,fees,college,state,experience,qualification} = await req.json();
        if(name){
            existingUser.fullName = name;
        }

        if(specialization){
            existingUser.doctorsProfile.specializations  = specialization;
        }
        if(address){
            existingUser.doctorsProfile.clinic[0].clinicAddress = address;
        }
        if(phone){
        existingUser.contactDetails = phone

        }

        if(email){
            existingUser.email = email;
        }
        if(fees){
            existingUser.doctorsProfile.consultationFees = fees;
        }

        if(college){
            existingUser.doctorsProfile.essentials.institute = college
        }

        if(state){
            existingUser.doctorsProfile.essentials.instituteLocation = state
        };
        if(experience){
            existingUser.doctorsProfile.experience = experience
        }

        if(qualification){
            if (!existingUser.doctorsProfile.qualifications.includes(qualification)) {
  existingUser.doctorsProfile.qualifications.push(qualification);
}
        }

        await existingUser.save();
        return NextResponse.json({message : "User Profile Updated Successfully",success : true,updatedUser : existingUser},{status : 200})


    } catch (error) {
        console.log(error);
        return NextResponse.json({message : "Internal Server Error",success : false},{status : 500})
    }
}