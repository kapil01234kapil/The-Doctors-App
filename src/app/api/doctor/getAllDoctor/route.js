import { connectDB } from "@/lib/db";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const allDoctors = await User.find({ role: "doctor" ,"doctorsProfile.verifiedDoctor" : true}).select("-password");

    if (!allDoctors || allDoctors.length === 0) {
      return NextResponse.json(
        {
          message: "No Doctors Present At This Moment",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "All Doctors List",
        success: true,
        doctors: allDoctors,   // ✅ return the doctors list
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
