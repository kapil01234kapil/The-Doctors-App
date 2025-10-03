import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const loggedInUser = await userModels.findById(userId).select("-password");
    if (!loggedInUser) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    const { id } = await params; // doctorId
    const doctorId = new mongoose.Types.ObjectId(id);

    // ✅ Define date boundaries (start of today → 7 days later)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date(startOfToday);
    sevenDaysLater.setDate(startOfToday.getDate() + 7);

    // ✅ Step 1: Remove expired pending appointments (>30 min old)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    await appointmentModels.deleteMany({
      doctor: doctorId,
      status: "pending",
      pendingTime: { $lt: thirtyMinsAgo },
    });

    // ✅ Step 2: Fetch doctor's weekly slot template
    let doctorSlots = await DoctorWeeklySlot.findOne({
      doctor: doctorId,
      effectiveFrom: { $lte: new Date() }, // still compare with now for template validity
    }).sort({ effectiveFrom: -1 });

    if (!doctorSlots) {
      return NextResponse.json(
        { success: false, message: "No valid slots found for this doctor" },
        { status: 404 }
      );
    }

    // ✅ Step 3: Fetch all active appointments in next 7 days
    const activeAppointments = await appointmentModels.find({
      doctor: doctorId,
      appointmentDate: { $gte: startOfToday, $lte: sevenDaysLater },
      status: { $in: ["pending", "confirmed", "completed"] },
    });

    console.log("activeAppointments", activeAppointments);

    // ✅ Step 4: Filter out booked slots
    const filteredSlots = {
      ...doctorSlots.toObject(),
      allSlot: doctorSlots.allSlot.map((dayObj) => {
        return {
          ...dayObj.toObject(),
          slots: dayObj.slots.filter((slot) => {
            const slotKey = `${slot.startTime} - ${slot.endTime}`;
            const isTaken = activeAppointments.some(
              (app) =>
                app.appointmentDay === dayObj.day &&
                app.bookedSlot === slotKey
            );
            return !isTaken;
          }),
        };
      }),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Doctor's available slots fetched",
        allSlots: filteredSlots,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getDoctorSlots error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
