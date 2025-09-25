import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Cannot Be Found", success: false },
        { status: 404 }
      );
    }

    const { appointmentId } = await req.json();
    if (!appointmentId) {
      return NextResponse.json(
        { message: "Appointment ID is required", success: false },
        { status: 400 }
      );
    }

    const existingAppointment = await appointmentModels.findById(appointmentId);
    if (!existingAppointment) {
      return NextResponse.json(
        { message: "No Appointment Found", success: false },
        { status: 404 }
      );
    }

    // --- New logic ---
    const now = new Date();
    const pendingTime = new Date(existingAppointment.pendingTime);

    const diffInMinutes = (now - pendingTime) / (1000 * 60); // difference in minutes
    console.log("Time difference in minutes:", diffInMinutes);

    if (diffInMinutes > 30) {
      // Pending time is more than 30 minutes ago → delete
      await appointmentModels.findByIdAndDelete(appointmentId);
      return NextResponse.json(
        {
          message: "Appointment expired (more than 30 minutes old) and has been deleted.",
          success: false,
        },
        { status: 200 }
      );
    }

    // Otherwise, appointment is still valid
    return NextResponse.json(
      {
        message: "Existing Appointment Found and still valid",
        success: true,
        id: existingAppointment._id,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
