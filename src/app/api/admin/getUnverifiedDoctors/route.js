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

    const unverifiedDoctors = await userModels.find({"doctorsProfile.verifiedDoctor" : false,blocked : false}).sort({createdAt : -1}).select("-password");
    if(!unverifiedDoctors || unverifiedDoctors.length === 0){
        return NextResponse.json({message : "No New Unverfied Users Present At This Time",success : false},{status : 400})
    }

    return NextResponse.json({message : "All The Unverified Users Fetched",success : true,unverifiedDoctors},{status : 200})
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
