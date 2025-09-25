import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        await connectDB()
        const userId = await getUserIdFromRequest(req)
        if(!userId){
            return NextResponse.json({success : false, message : "Unauthorized"}, {status : 401})
        }

        const existingUser= await userModels.findById(userId).select("-password");
        if(!existingUser){
            return NextResponse.json({success : false, message : "User not found"}, {status : 404})
        }

        const {upiId} = await req.json()

        if(!upiId || upiId.trim() === ""){
            return NextResponse.json({success : false, message : "UPI ID is required"}, {status : 400})
        }
        existingUser.upiId = upiId
        await existingUser.save()

        return NextResponse.json({success : true, message : "UPI ID added successfully",upiId}, {status : 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success : false, message : "Internal Server Error"}, {status : 500})
    }
}