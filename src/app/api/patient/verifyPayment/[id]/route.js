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
import referralModels from "@/models/referralModels";

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

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, appointmentId } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { message: "Payment verification details missing", success: false },
        { status: 400 }
      );
    }

    const existingAppointment = await appointmentModels.findById(appointmentId);
    if (!existingAppointment) {
      return NextResponse.json(
        { message: "No Such Appointment Found", success: false },
        { status: 404 }
      );
    }

    existingAppointment.status = "confirmed";
    existingAppointment.paymentStatus = "confirmed";

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
    const nearestWeeklySlot = await DoctorWeeklySlot.findOne({
      doctor: doctorId,
      effectiveFrom: { $lte: now },
    }).sort({ effectiveFrom: -1 });

    if (!nearestWeeklySlot) {
      return NextResponse.json(
        { message: "No valid weekly slot configuration found", success: false },
        { status: 404 }
      );
    }

    const dayObj = nearestWeeklySlot.allSlot.find(
      (d) => d.day === appointmentDay
    );

    if (!dayObj) {
      return NextResponse.json(
        { message: "No such day slot found", success: false },
        { status: 404 }
      );
    }

    const [slotStartTime, slotEndTime] =
      existingAppointment.bookedSlot.split(" - ");

    const slotObj = dayObj.slots.find(
      (s) => s.startTime === slotStartTime && s.endTime === slotEndTime
    );

    if (!slotObj) {
      return NextResponse.json(
        { message: "No such time slot found", success: false },
        { status: 404 }
      );
    }

    slotObj.status = "confirmed";
    slotObj.patientName = existingAppointment.patientProfile.name;

    await nearestWeeklySlot.save();

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        verified: true,
        status: "paid",
      }
    );

    const appointmentDate = new Date(existingAppointment.appointmentDate);
    const weekStart = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate()
    );
    const weekEnd = addDays(weekStart, 6);

    const consultationFee = existingAppointment.consultationFees || 0;
    const platformFee = consultationFee * 0.025;
    const payable = consultationFee - platformFee;

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

    // 🩺 Increment doctor's total appointments
    if (existingDoctor?.doctorsProfile?.totalNumberOfAppointments !== undefined) {
      existingDoctor.doctorsProfile.totalNumberOfAppointments += 1;
      await existingDoctor.save();
    }

    // 💰 Referral Bonus Logic
    if (existingDoctor?.doctorsProfile?.totalNumberOfAppointments <= 25) {
      const doctorReferralRecord = await referralModels
        .findOne({ user: doctorId })
        .select("referKrneWaala");

      if (doctorReferralRecord?.referKrneWaala) {
        const referKrneWaalaKaRecord = await referralModels.findOne({
          user: doctorReferralRecord.referKrneWaala,
        });

        if (referKrneWaalaKaRecord) {
          const referredUserObj = referKrneWaalaKaRecord.referredUsers.find(
            (r) => r.referredUser.toString() === doctorId.toString()
          );

          if (referredUserObj) {
            // Increase numberOfAppointment
            referredUserObj.numberOfAppointment += 1;

            // If doctor completed 25 appointments, credit bonus
            if (
              referredUserObj.numberOfAppointment >= 25 &&
              !referredUserObj.bonusCredited
            ) {
              referredUserObj.bonusCredited = true;
              referredUserObj.status = "Completed";
              referKrneWaalaKaRecord.bonusEarned += 100;
              referKrneWaalaKaRecord.successfullReferrals += 1; 
            }

            await referKrneWaalaKaRecord.save();
          }
        }
      }
    }

    await existingAppointment.save();
    await existingUser.save();

    await notificationModels.create({
      title: "Appointment Confirmed",
      reciever: doctorId,
      sender: userId,
      type: "Appointment",
      highPriority: true,
      message: `${existingUser.fullName} booked an appointment with you for the time slot ${slotStartTime} on ${dayObj.day}`,
    });

    await notificationModels.create({
      title: "Appointment Confirmed",
      reciever: userId,
      sender: doctorId,
      type: "Appointment",
      highPriority: true,
      message: `You have booked an appointment with Dr. ${existingDoctor?.fullName} for the time slot ${slotStartTime} on ${dayObj.day}`,
    });

    return NextResponse.json(
      {
        message: "Payment Verified & Appointment Confirmed",
        success: true,
        appointmentId: existingAppointment._id,
        slotUpdated: true,
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
