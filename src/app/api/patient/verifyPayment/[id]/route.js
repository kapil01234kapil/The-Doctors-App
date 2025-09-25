import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import userModels from "@/models/userModels";
import DoctorWeeklySlot from "@/models/DoctorWeeklySlot";
import Payment from "@/models/paymentModel";
import { NextResponse } from "next/server";
import notificationModels from "@/models/notificationModels";
import { Finance } from "@/models/financeModels";
import { addDays } from "date-fns";

export async function POST(req) {
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

    console.log("this is user id", userId);

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, appointmentId } = body;
    console.log(
      "data recieved",
      razorpay_order_id,
      razorpay_payment_id,
      appointmentId
    );
    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { message: "Payment verification details missing", success: false },
        { status: 400 }
      );
    }

    // ✅ Find appointment
    const existingAppointment = await appointmentModels.findById(appointmentId);
    if (!existingAppointment) {
      return NextResponse.json(
        { message: "No Such Appointment Found", success: false },
        { status: 404 }
      );
    }

    // ✅ Mark appointment as confirmed
    existingAppointment.status = "confirmed";
    existingAppointment.paymentStatus = "confirmed";

    // ✅ Reset spamBooking
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

    // ✅ Update slot in doctor's schedule
    const appointmentDay = existingAppointment.appointmentDay;
    const slotId = existingAppointment.bookedSlot;
    const doctorId = existingAppointment.doctor;

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
    console.log(
      "this is the fees ",
      existingDoctor?.doctorsProfile?.consultationFees
    );
    console.log("this is the earning", existingDoctor?.doctorsProfile?.earning);

    await existingDoctor.save();

    if (!appointmentDay || !slotId || !doctorId) {
      return NextResponse.json(
        {
          message: "Appointment missing day/slot/doctor info",
          success: false,
        },
        { status: 404 }
      );
    }

    const now = new Date();

    // Step 1️⃣: Find the nearest valid DoctorWeeklySlot
    // Step 1️⃣: Find the nearest valid DoctorWeeklySlot
    const nearestWeeklySlot = await DoctorWeeklySlot.findOne({
      doctor: doctorId,
      effectiveFrom: { $lte: now },
    }).sort({ effectiveFrom: -1 });
    console.log("nearestWeeklySlot", nearestWeeklySlot);
    if (!nearestWeeklySlot) {
      return NextResponse.json(
        { message: "No valid weekly slot configuration found", success: false },
        { status: 404 }
      );
    }

    // Step 2️⃣: Find the correct day object
    const dayObj = nearestWeeklySlot.allSlot.find(
      (d) => d.day === appointmentDay
    );
    console.log("dayobject", dayObj);
    if (!dayObj) {
      return NextResponse.json(
        { message: "No such day slot found", success: false },
        { status: 404 }
      );
    }

    // Step 3️⃣: Find the correct slot object
    // Step 3️⃣: Parse bookedSlot
    const [slotStartTime, slotEndTime] =
      existingAppointment.bookedSlot.split(" - ");

    // Step 4️⃣: Find the correct slot object
    const slotObj = dayObj.slots.find(
      (s) => s.startTime === slotStartTime && s.endTime === slotEndTime
    );
    console.log("slotobject", slotObj);
    if (!slotObj) {
      return NextResponse.json(
        { message: "No such time slot found", success: false },
        { status: 404 }
      );
    }

    // Step 5️⃣: Update the slot
    slotObj.status = "confirmed";
    slotObj.patientName = existingAppointment.patientProfile.name;

    // Step 6️⃣: Save the document
    await nearestWeeklySlot.save();

    // ✅ Mark payment as verified (no signature for now)
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        verified: true,
        status: "paid",
      }
    );

   // 1. Take the appointmentDate
const appointmentDate = new Date(existingAppointment.appointmentDate);

// 2. Define weekStart = appointmentDate at midnight
const weekStart = new Date(
  appointmentDate.getFullYear(),
  appointmentDate.getMonth(),
  appointmentDate.getDate()
);

// 3. weekEnd = weekStart + 6 days
const weekEnd = addDays(weekStart, 6);

// 4. Calculate amounts
const consultationFee = existingAppointment.consultationFees || 0;
const platformFee = consultationFee * 0.05; // adjust % as per your logic
const payable = consultationFee - platformFee;

// 5. Find if a finance record already exists for this doctor in this window
let financeRecord = await Finance.findOne({
  doctor: doctorId,
  weekStart: { $lte: appointmentDate },
  weekEnd: { $gte: appointmentDate },
});

if (financeRecord) {
  financeRecord.appointments.push(existingAppointment._id);
  financeRecord.totalAmount += consultationFee;
  financeRecord.platformFees += platformFee;
  financeRecord.payableAmount += payable;
  await financeRecord.save();
} else {
  financeRecord = await Finance.create({
    doctor: doctorId,
    weekStart,
    weekEnd,
    appointments: [existingAppointment._id],
    totalAmount: consultationFee,
    platformFees: platformFee,
    payableAmount: payable,
  });
}


    await existingAppointment.save();
    await existingUser.save();

    await notificationModels.create({
      title: "Appointment Confirmed",
      reciever: doctorId,
      sender: userId,
      type: "Appointment",
      highPriority: true,

      message: `${existingUser.fullName} booked a appointment with you for the time slot ${slotStartTime} on ${dayObj.day} `,
    });

    await notificationModels.create({
      title: "Appointment Confirmed",
      reciever: userId,
      sender: doctorId,
      type: "Appointment",
      highPriority: true,
      message: `You have a booked a appointment with Dr ${existingDoctor?.fullName} for the time slot ${slotStartTime} on ${dayObj.day}`,
    });

    return NextResponse.json(
      {
        message: "Payment Verified & Appointment Confirmed",
        success: true,
        appointmentId: existingAppointment._id,
        slotUpdated: true, // ✅ fixed
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Verify payment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
