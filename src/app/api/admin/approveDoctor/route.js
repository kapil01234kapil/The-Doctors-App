import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
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
    if (!existingAdmin || existingAdmin?.role !== "admin") {
      return NextResponse.json(
        {
          message: "You Are Not Authorized to take this action",
          success: false,
        },
        { status: 403 }
      );
    }

    const { doctorId, action } = await req.json();
    if (!doctorId || !action) {
      return NextResponse.json(
        { message: "Doctor ID or Action Missing", success: false },
        { status: 400 }
      );
    }

    const existingDoctor = await userModels.findById(doctorId).select("-password");
    if (!existingDoctor) {
      return NextResponse.json(
        { message: "No Doctor Found", success: false },
        { status: 404 }
      );
    }

    if (action === "accept") {
      existingDoctor.doctorsProfile.verifiedDoctor = true;
const updatedSlot = await DoctorWeeklySlot.findOne({ doctor: doctorId }).sort({ createdAt: -1 });
      updatedSlot.effectiveFrom = new Date();
      await updatedSlot.save();
    } else {
      existingDoctor.doctorsProfile.verifiedDoctor = false;
      existingDoctor.doctorsProfile.verificationStatus = "rejected";
    }

    await existingDoctor.save();

    return NextResponse.json(
      { message: "Doctor Verification Status Updated Successfully", success: true,existingDoctor },
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
