import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

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

    const { id } = await params;
    const now = new Date();
    const THIRTY_MINUTES = 30 * 60 * 1000;

    // 🔹 Find doctor's latest effective slots
    let doctorSlots = await DoctorWeeklySlot.findOne({
      doctor: id,
      effectiveFrom: { $lte: now },
    }).sort({ effectiveFrom: -1 });

    if (!doctorSlots) {
      return NextResponse.json(
        { success: false, message: "No valid slots found for this doctor" },
        { status: 404 }
      );
    }

    let updated = false;

    // 🔹 Iterate through slots and reset expired ones
    doctorSlots.allSlot.forEach((dayObj) => {
      dayObj.slots.forEach((slot) => {
        if (
          slot.isBooked &&
          slot.status === "waiting" &&
          slot.isPending &&
          now - new Date(slot.isPending) > THIRTY_MINUTES
        ) {
          slot.isBooked = false;
          slot.status = "free";
          slot.isPending = null;
          updated = true;
        }
      });
    });

    // 🔹 Save only if something changed
    if (updated) {
      await doctorSlots.save();
    }

    // 🔹 Return only free slots
    const filteredSlots = {
      ...doctorSlots.toObject(),
      allSlot: doctorSlots.allSlot.map((dayObj) => ({
        ...dayObj.toObject(),
        slots: dayObj.slots.filter((slot) => slot.isBooked === false),
      })),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Doctor's latest effective slots fetched",
        allSlots: filteredSlots,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
