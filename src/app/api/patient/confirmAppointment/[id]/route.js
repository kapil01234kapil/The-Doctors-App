import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
import { NextResponse } from "next/server";
import { User } from "lucide-react";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token is Missing", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const { id } = await params; // appointmentId
    const existingAppointment = await appointmentModels.findById(id);
    if (!existingAppointment) {
      return NextResponse.json(
        { message: "No Such Appointment Found", success: false },
        { status: 400 }
      );
    }

    const { name, phoneNumber, age, gender } = await req.json();
    if (!name || !phoneNumber || !age || !gender) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 400 }
      );
    }

    // ✅ Update appointment details
    existingAppointment.status = "confirmed";
    existingAppointment.patientProfile.name = name;
    existingAppointment.patientProfile.phoneNumber = phoneNumber;
    existingAppointment.patientProfile.age = age;
    existingAppointment.patientProfile.gender = gender;
    existingAppointment.pendingTime = null;

    // ✅ Decrement spamBooking (floor at 0)
    if (!existingUser.spamBooking) {
      existingUser.spamBooking = {
        count: 0,
        firstAttemptAt: null,
      };
    }

    if (existingUser.spamBooking.count > 0) {
      existingUser.spamBooking.count = 0;
      existingUser.spamBooking.firstAttemptAt = null;
    }

    // ✅ Update the exact slot: set status "confirmed" and patientName = name
    // We rely on data already stored on the appointment.
    const appointmentDay = existingAppointment.appointmentDay; // e.g. "Tuesday"
    const slotId = existingAppointment?.bookedSlot; // ObjectId of the slot subdoc
    const doctorId = existingAppointment.doctor;
    console.log("values ", appointmentDay, slotId, doctorId); // doctor ref

    if (!appointmentDay || !slotId || !doctorId) {
      return NextResponse.json(
        {
          message: "Appointment is missing day/slot/doctor information",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingDoctor = await userModels
      .findById(doctorId)
      .select("-password");
    if (!existingDoctor) {
      return NextResponse.json(
        { message: "No Such Doctor Found", success: false },
        { status: 404 }
      );
    }

    existingDoctor.doctorsProfile.earning +=
      existingDoctor?.doctorsProfile?.consultationFees || 0;
      console.log("this is the fees ",existingDoctor?.doctorsProfile?.consultationFees);
      console.log("this is the earning",existingDoctor?.doctorsProfile?.earning)

      await existingDoctor.save()
    const updatedDoctorSlots = await DoctorWeeklySlot.findOneAndUpdate(
      {
        doctor: doctorId,
        "allSlot.day": appointmentDay,
        "allSlot.slots._id": slotId,
      },
      {
        $set: {
          "allSlot.$[day].slots.$[slot].status": "confirmed",
          "allSlot.$[day].slots.$[slot].patientName": name,
        },
      },
      {
        new: true,
        arrayFilters: [{ "day.day": appointmentDay }, { "slot._id": slotId }],
      }
    );

    await existingAppointment.save();
    await existingUser.save();

    return NextResponse.json(
      {
        message: "Appointment Confirmed Successfully",
        success: true,
        appointmentId: existingAppointment._id,
        slotUpdated: Boolean(updatedDoctorSlots),
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Confirm appointment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
