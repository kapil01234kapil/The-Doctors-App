import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
import notificationModels from "@/models/notificationModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId } = await req.json();
    if (!appointmentId) {
      return NextResponse.json({ success: false, message: "Appointment ID missing" }, { status: 400 });
    }

    const appointment = await appointmentModels.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 });
    }

    // 🔐 Mark appointment confirmed
    appointment.status = "confirmed";
    appointment.paymentStatus = "free";

    const doctor = await userModels.findById(appointment.doctor);
    const patient = await userModels.findById(userId);

    // 🕒 Update doctor slot
    const now = new Date();
    const weeklySlot = await DoctorWeeklySlot.findOne({
      doctor: appointment.doctor,
      effectiveFrom: { $lte: now },
    }).sort({ effectiveFrom: -1 });

    const dayObj = weeklySlot.allSlot.find(d => d.day === appointment.appointmentDay);
    const [startTime, endTime] = appointment.bookedSlot.split(" - ");
    const slotObj = dayObj.slots.find(
      s => s.startTime === startTime && s.endTime === endTime
    );

    slotObj.status = "confirmed";
    slotObj.patientName = appointment.patientProfile?.name || patient.fullName;

    await weeklySlot.save();
    await appointment.save();

    // 🔔 Notifications
    await notificationModels.create({
      title: "Appointment Confirmed (Free)",
      sender: userId,
      reciever: appointment.doctor,
      type: "Appointment",
      highPriority: true,
      message: `${patient.fullName} booked a FREE appointment for ${startTime}`,
    });

    await notificationModels.create({
      title: "Appointment Confirmed",
      sender: appointment.doctor,
      reciever: userId,
      type: "Appointment",
      highPriority: true,
      message: `Your FREE appointment is confirmed for ${startTime}`,
    });

    return NextResponse.json({
      success: true,
      message: "Appointment confirmed (Free)",
    });
  } catch (error) {
    console.error("Free confirm error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
