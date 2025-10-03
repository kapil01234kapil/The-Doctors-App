import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token is missing", success: false },
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

    // spamBooking check (your existing logic kept same)
    if (!existingUser.spamBooking) {
      existingUser.spamBooking = { count: 0, firstAttemptAt: null };
    }
    if (
      existingUser.spamBooking.firstAttemptAt &&
      new Date() - existingUser.spamBooking.firstAttemptAt > 24 * 60 * 60 * 1000
    ) {
      existingUser.spamBooking.count = 0;
      existingUser.spamBooking.firstAttemptAt = null;
    }
    if (existingUser.spamBooking.count >= 7) {
      return NextResponse.json(
        {
          message:
            "You are restricted from making more bookings for the day due to excessive failed bookings.",
          success: false,
        },
        { status: 429 }
      );
    }
    if (existingUser.spamBooking.count === 0) {
      existingUser.spamBooking.firstAttemptAt = new Date();
    }
    existingUser.spamBooking.count += 1;

    const { id } = await params; // doctorId
    const {
      message,
      appointmentDate,
      appointmentDay,
      bookedSlot,
      consultationFees,
      clinicAddress,
    } = await req.json();

    if (!appointmentDate || !appointmentDay || !bookedSlot) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 400 }
      );
    }

    // ✅ Step 1: Clean expired pending appointments (>30 min old)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    await appointmentModels.deleteMany({
      doctor: id,
      status: "pending",
      pendingTime: { $lt: thirtyMinsAgo },
    });

    // ✅ Step 2: Create new appointment
    const newAppointment = await appointmentModels.create({
      patient: userId,
      doctor: id,
      appointmentDate,
      appointmentDay,
      bookedSlot: `${bookedSlot.startTime} - ${bookedSlot.endTime}`,
      notes: message,
      consultationFees,
      clinicAddress,
      status: "pending",
      pendingTime: new Date(),
    });

    await existingUser.save();

    return NextResponse.json(
      {
        message: "Appointment Booked Successfully",
        success: true,
        newAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Book appointment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
