import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import DoctorSchedule from "@/models/DoctorSchedule";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest(req);
    console.log("Authenticated User ID:", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
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

    const doctorsSchedule = await DoctorSchedule.findOne({ doctor: userId });
    if (!doctorsSchedule) {
      return NextResponse.json(
        { message: "Doctor Schedule Not Found", success: false },
        { status: 404 }
      );
    }

    const body = await req.json();
    console.log("Received Data for Update:", body);

    const {
      age,
      appointmentApproval,
      clinicAddress,
      state,
      consultationFees,
      gender,
      slotDuration,
      weeklySchedule,
      clinicName
    } = body;

    // --- Update User fields if present ---
    if (age !== undefined) existingUser.age = Number(age);
    if (gender !== undefined) existingUser.gender = gender;

    if (!existingUser.doctorsProfile) existingUser.doctorsProfile = {};

    if (appointmentApproval !== undefined) {
      existingUser.doctorsProfile.appointmentApproval = Boolean(appointmentApproval);
    }

    if (consultationFees !== undefined) {
      existingUser.doctorsProfile.consultationFees = Number(consultationFees);
    }

    if (!Array.isArray(existingUser.doctorsProfile.clinic)) {
      existingUser.doctorsProfile.clinic = [{}];
    }

    if (clinicAddress !== undefined) {
      existingUser.doctorsProfile.clinic[0].clinicAddress = clinicAddress;
    }
    if (state !== undefined) {
      existingUser.doctorsProfile.clinic[0].state = state;
    }
    if (clinicName !== undefined) {
      existingUser.doctorsProfile.clinic[0].clinicName = clinicName;
    }

    // --- Update DoctorSchedule fields if present ---
    if (weeklySchedule !== undefined) {
      doctorsSchedule.weeklySchedule = (Array.isArray(weeklySchedule) ? weeklySchedule : []).map(
        (d) => ({
          day: d.day,
          isActive: Boolean(d.isActive),
          slotDuration:
            d.slotDuration !== undefined
              ? Number(d.slotDuration)
              : (slotDuration !== undefined ? Number(slotDuration) : undefined),
          slots: Array.isArray(d.slots)
            ? d.slots.map((s) => ({
                startTime: s.startTime,
                endTime: s.endTime,
                isBooked: Boolean(s.isBooked),
              }))
            : [],
        })
      );
    }

    await doctorsSchedule.save();

    // Ensure link from user to schedule is correct
    if (
      !existingUser.weeklySchedule ||
      existingUser.weeklySchedule.toString() !== doctorsSchedule._id.toString()
    ) {
      existingUser.weeklySchedule = doctorsSchedule._id;
    }

    await existingUser.save();

    return NextResponse.json(
      {
        message: "Doctor profile & schedule updated successfully",
        success: true,
        user: existingUser,
        weeklySchedule: doctorsSchedule.weeklySchedule,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
