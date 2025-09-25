import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import Payment from "@/models/paymentModel";
import appointmentModels from "@/models/appointmentModels";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
console.log("Razorpay Key ID:", `"${process.env.RAZORPAY_API_KEY}"`);
console.log("Razorpay Secret:", `"${process.env.RAZORPAY_API_SECRET}"`);


export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // appointmentId
    const { amount, name, phoneNumber, age, gender } = await req.json();

    const existingAppointment = await appointmentModels.findById(id);
    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (!name || !phoneNumber || !age || !gender) {
      return NextResponse.json(
        { success: false, message: "Patient details missing" },
        { status: 400 }
      );
    }

    // ✅ Save patient details (status still "waiting")
    existingAppointment.patientProfile.name = name;
    existingAppointment.patientProfile.phoneNumber = phoneNumber;
    existingAppointment.patientProfile.age = age;
    existingAppointment.patientProfile.gender = gender;
    await existingAppointment.save();

    // ✅ Create Razorpay order
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${id}`,
    };
    const order = await razorpay.orders.create(options);

    // ✅ Save in DB
    const payment = await Payment.create({
      appointment: id,
      razorpayOrderId: order.id,
      amount,
    });

    return NextResponse.json(
      { success: true, order, paymentId: payment._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { success: false, message: "Payment order creation failed" },
      { status: 500 }
    );
  }
}
