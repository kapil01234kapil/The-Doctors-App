import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import blockedUserModels from "@/models/blockedUserModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        await connectDB();
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({message : "Token Missing",success : false},{status : 401})
        }

        const existingAdmin = await userModels.findById(userId).select("-password");
        if(!existingAdmin || existingAdmin?.role !== "admin"){
            return NextResponse.json({message : "You Are Not Authorized to take this action",success : false},{status : 403})
        }

        const {id,email,name,reasonForBlocking,role,phoneNumber} = await req.json();
        if(!id || !email || !name || !reasonForBlocking || !role || !phoneNumber){
            return NextResponse.json({message : "Something is Missing",success : false},{status : 400})
        }

        const blockedUser = await userModels.findByIdAndUpdate(id,{blocked : true});
        if(!blockedUser){
            return NextResponse.json({message : "User Cannot Be Blocked",success : false},{status : 400})
        }
        const newBlockedModel = await blockedUserModels.create({
            userId : id,
            name,
            phoneNumber,
            email,
            reasonForBlocking,
            role
        })

        if(!newBlockedModel){
            return NextResponse.json({message : "New Record Cannot Be Created" ,success : false},{status : 400})
        }
        return NextResponse.json({message : `${blockedUser?.fullName} blocked Successfully`,success : true},{status : 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({message : "Internal Server Error",success : false},{status : 500})
    }
}