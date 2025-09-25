import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import DoctorSchedule from "@/models/DoctorSchedule";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(req); // ✅ pass req
    if (!userId) {
      return NextResponse.json(
        { message: "Token is Missing", success: false },
        { status: 401 }
      );
    }

    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    if (existingUser.role !== "doctor") {
      return NextResponse.json(
        {
          message: "You Are Not Authorized to Make This Action",
          success: false,
        },
        { status: 403 }
      );
    }

    const { weeklySchedule } = await req.json();
    if (!weeklySchedule) {
      return NextResponse.json(
        { message: "Weekly Schedule is Missing", success: false },
        { status: 400 }
      );
    }

    const doctorSchedule = await DoctorSchedule.findOne({ doctor: userId });
    if (!doctorSchedule) {
      return NextResponse.json(
        { message: "Doctor Schedule Not Found", success: false },
        { status: 404 }
      );
    }

    // Update weekly schedule
    doctorSchedule.weeklySchedule = weeklySchedule;

    // Saving this will trigger the post("save") hook
    await doctorSchedule.save();

    const date = new Date();
    date.setDate(date.getDate() + 7);

    return NextResponse.json(
      {
        message: `Your new weekly schedule will be implemented from ${date.toDateString()}`,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
