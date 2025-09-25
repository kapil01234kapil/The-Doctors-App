import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/userModels"; // don't forget to import your model

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    // find user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    // generate random 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    // set expiry to 10 minutes from now
    const otpExpire = Date.now() + 10 * 60 * 1000;

    // save in DB
    existingUser.otp = otp;
    existingUser.otpExpire = otpExpire;
    await existingUser.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_NEXTCONNECTHUB,
        pass: process.env.PASSWORD_NEXTCONNECTHUB,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_NEXTCONNECTHUB,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully", success: true },
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
