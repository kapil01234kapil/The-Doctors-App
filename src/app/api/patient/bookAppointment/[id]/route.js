import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
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

    // Ensure spamBooking exists
    if (!existingUser.spamBooking) {
      existingUser.spamBooking = { count: 0, firstAttemptAt: null };
    }

    // Reset after 24h
    if (
      existingUser.spamBooking.firstAttemptAt &&
      new Date() - existingUser.spamBooking.firstAttemptAt > 24 * 60 * 60 * 1000
    ) {
      existingUser.spamBooking.count = 0;
      existingUser.spamBooking.firstAttemptAt = null;
    }

    // If already blocked
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

    // First attempt of the day
    if (existingUser.spamBooking.count === 0) {
      existingUser.spamBooking.firstAttemptAt = new Date();
    }

    // Increment booking attempt
    existingUser.spamBooking.count += 1;

    const { id } = await params; // doctorId
    const {
      message,
      appointmentDate,
      appointmentDay,
      bookedSlot,
      consultationFees,
      clinicAddress
    } = await req.json();

    if (!appointmentDate || !appointmentDay || !bookedSlot) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 400 }
      );
    }

    // ✅ Step 1: Free up expired pending slots (>30 mins old)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

    const now = new Date();

    const nearestWeeklySlot = await DoctorWeeklySlot.findOne({
      doctor: id,
      effectiveFrom: { $lte: now },
    }).sort({ effectiveFrom: -1 });

    if (!nearestWeeklySlot) {
      return NextResponse.json(
        { message: "No valid weekly slot configuration found", success: false },
        { status: 404 }
      );
    }

    // Step 1️⃣: Free expired pending slots
    const updatedExpiredSlots = await DoctorWeeklySlot.updateOne(
      {
        _id: nearestWeeklySlot._id,
        "allSlot.day": appointmentDay,
      },
      {
        $set: {
          "allSlot.$[day].slots.$[expired].isBooked": false,
          "allSlot.$[day].slots.$[expired].status": "free",
          "allSlot.$[day].slots.$[expired].isPending": null,
        },
      },
      {
        arrayFilters: [
          { "day.day": appointmentDay },
          {
            "expired.isBooked": true,
            "expired.isPending": { $lt: thirtyMinsAgo },
          },
        ],
      }
    );

    // Step 2️⃣: Update the selected booked slot
    const updatedSelectedSlot = await DoctorWeeklySlot.updateOne(
      {
        _id: nearestWeeklySlot._id,
        "allSlot.day": appointmentDay,
        "allSlot.slots._id": bookedSlot._id,
      },
      {
        $set: {
          "allSlot.$[day].slots.$[slot].isBooked": true,
          "allSlot.$[day].slots.$[slot].status": "waiting",
          "allSlot.$[day].slots.$[slot].isPending": new Date(),
        },
      },
      {
        arrayFilters: [
          { "day.day": appointmentDay },
          { "slot._id": bookedSlot._id },
        ],
      }
    );

    // ✅ Step 2: Create new appointment
    const newAppointment = await appointmentModels.create({
      patient: userId,
      doctor: id,
      appointmentDate,
      appointmentDay,
      bookedSlot: `${bookedSlot.startTime} - ${bookedSlot.endTime}`, // 👈 build range string
      notes: message,
      consultationFees,
      clinicAddress
    });

    console.log("Created appointment:", newAppointment);


    if (!newAppointment) {
      return NextResponse.json(
        {
          message: "Something Went Wrong Retry after sometime",
          success: false,
          appointmentId : newAppointment?._id
        },
        { status: 400 }
      );
    }

    // ✅ Step 3: Update the selected booked slot
    const updatedDoctorSlots = await DoctorWeeklySlot.findOneAndUpdate(
      {
        doctor: id,
        "allSlot.day": appointmentDay,
        "allSlot.slots._id": bookedSlot._id, // find that exact slot
      },
      {
        $set: {
          "allSlot.$[day].slots.$[slot].isBooked": true,
          "allSlot.$[day].slots.$[slot].status": "waiting",
          "allSlot.$[day].slots.$[slot].isPending": new Date(),
        },
      },
      {
        new: true,
        arrayFilters: [
          { "day.day": appointmentDay },
          { "slot._id": bookedSlot._id },
        ],
      }
    );

    await existingUser.save();

    return NextResponse.json(
      {
        message: "Appointment Booked Successfully",
        success: true,
        newAppointment,
        updatedDoctorSlots,
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
