import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Missing", success: false },
        { status: 401 }
      );
    }

    const existingAdmin = await userModels.findById(userId).select("-password");
    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json(
        {
          message: "You Are Not Authorized to get this detail",
          success: false,
        },
        { status: 403 }
      );
    }

    const getAllDoctors = await userModels.find({role : "doctor"}).sort({createdAt : -1}).select("-password -otp");
    if(!getAllDoctors || getAllDoctors.length === 0){
        return NextResponse.json({message : "No Doctors Present at this moment",success : false},{status : 400})
    };

    return NextResponse.json({message : "All The Doctors Fetched Properly",success : true,doctors : getAllDoctors},{status : 200})
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
