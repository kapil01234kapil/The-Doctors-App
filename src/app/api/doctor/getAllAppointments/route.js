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
    if (existingUser.role !== "doctor") {
      return NextResponse.json(
        { message: "You Are Not Allowed To Access This", success: false },
        { status: 400 }
      );
    }

    // Delete expired pending appointments
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    await appointmentModels.deleteMany({
      status: "pending",
      pendingTime: { $lt: oneHourAgo },
    });

    // Fetch all non-pending appointments
    let doctorAppointments = await appointmentModels
      .find({
        doctor: userId,
        status: { $ne: "pending" }, // Exclude pending
      })
      .sort({ createdAt: -1 });

    if (!doctorAppointments || doctorAppointments.length === 0) {
      return NextResponse.json(
        { message: "No Relevant Appointments Found", success: false },
        { status: 404 }
      );
    }

    const now = new Date();

    // Update status to 'completed' if appointmentDate is in the past and status is 'confirmed'
    const updatePromises = doctorAppointments.map(async (appointment) => {
      if (
        appointment.status === "confirmed" &&
        new Date(appointment.appointmentDate) < now
      ) {
        appointment.status = "completed";
        await appointment.save();

        await notificationModels.create({
          reciever: appointment?.patient,
          sender: userId,
          title: "Feedback",
          message: `Your appointment with Dr. ${existingUser?.fullName} has been marked as completed. You can now provide feedback.`,
          type: "Feedback",
          reviewGiven: false,
        });
      }
    });

    await Promise.all(updatePromises);

    // Refetch updated appointments
    doctorAppointments = await appointmentModels
      .find({
        doctor: userId,
        status: { $ne: "pending" },
      }).populate('patient', 'profilePhoto')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "All non-pending appointments fetched successfully",
        success: true,
        appointments: doctorAppointments,
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
