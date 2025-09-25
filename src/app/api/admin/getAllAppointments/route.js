import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET() {
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

    const allAppointments = await appointmentModels
      .find({ status: { $ne: "pending" } })
      .sort({ createdAt: -1 })
      .populate({ path: "patient", select: "profilePhoto fullName" })
      .populate({ path: "doctor", select: "profilePhoto fullName doctorsProfile.specializations" });
    if (!allAppointments || allAppointments.length === 0) {
      return NextResponse.json(
        { message: "No Appointment Present At This Moment ", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "All The Appointments Fetched Successfully",
        success: true,
        allAppointments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
