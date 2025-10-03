import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import notificationModels from "@/models/notificationModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId);
    if (existingUser.role !== "patient") {
      return NextResponse.json(
        { message: "You Are Not Allowed To Access This", success: false },
        { status: 400 }
      );
    }

    // 🔹 First fetch appointments (not pending), sorted by appointmentDate DESC
    let confirmedAppointments = await appointmentModels
      .find({ patient: userId, status: { $ne: "pending" } })
      .populate({
        path: "doctor",
        select: "fullName profilePhoto contactDetails age",
      })
      .sort({ appointmentDate: -1 });

    console.log("all the confirmed appointments", confirmedAppointments);

    if (!confirmedAppointments || confirmedAppointments.length === 0) {
      return NextResponse.json(
        {
          message: "No Confirmed Appointment Found At This moment",
          success: false,
        },
        { status: 404 }
      );
    }

    const now = new Date();

    // ✅ Update status to 'completed' only if the whole day of appointment has passed
    const updatePromises = confirmedAppointments.map(async (appointment) => {
      if (appointment.status === "confirmed") {
        const appointmentDate = new Date(appointment.appointmentDate);
        const endOfAppointmentDay = new Date(appointmentDate);
        endOfAppointmentDay.setHours(23, 59, 59, 999);

        if (now > endOfAppointmentDay) {
          appointment.status = "completed";
          await appointment.save();

          await notificationModels.create({
            reciever: userId, // patient
            sender: appointment?.doctor,
            title: "Appointment Completed",
            message: `Your appointment with Dr. ${appointment?.doctor?.fullName} has been marked as completed. You can now provide feedback.`,
            type: "Feedback",
            reviewGiven: false,
          });
        }
      }
    });

    await Promise.all(updatePromises);

    // 🔹 Refetch updated appointments with appointmentDate DESC
    confirmedAppointments = await appointmentModels
      .find({ patient: userId, status: { $ne: "pending" } })
      .populate({
        path: "doctor",
        select:
          "fullName profilePhoto contactDetails age doctorsProfile.specializations doctorsProfile.clinic.clinicAddress",
      })
      .sort({ appointmentDate: -1 });

    return NextResponse.json(
      {
        message: "All The Confirmed Appointments Of Patient Fetched",
        success: true,
        confirmedAppointments,
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
