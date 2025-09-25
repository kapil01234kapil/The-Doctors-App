import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 404 }
      );
    }


    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { oldEmail, newEmail, otp } = body;

    // Step 1: Send OTP
    if (oldEmail && newEmail && !otp) {
      if (existingUser.email !== oldEmail) {
        return NextResponse.json(
          { message: "Old Email does not match", success: false },
          { status: 400 }
        );
      }

      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);

      // Store OTP & Expiry (10 mins)
      existingUser.otp = generatedOtp;
      existingUser.otpExpiry = Date.now() + 10 * 60 * 1000;
      await existingUser.save();

      // Send OTP mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_NEXTCONNECTHUB,
          pass: process.env.PASSWORD_NEXTCONNECTHUB,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_NEXTCONNECTHUB,
        to: oldEmail,
        subject: "Recovery Email Verification OTP",
        text: `Your OTP for verifying new email is: ${generatedOtp}`,
      });

      return NextResponse.json(
        { message: "OTP sent successfully", success: true },
        { status: 200 }
      );
    }

    // Step 2: Verify OTP & update email
    if (otp) {
      if (
        existingUser.otp !== Number(otp) ||
        existingUser.otpExpiry < Date.now()
      ) {
        return NextResponse.json(
          { message: "Invalid or Expired OTP", success: false },
          { status: 400 }
        );
      }

      // Update email
      existingUser.otp = null;
     existingUser.recoveryEmail = newEmail;
      await existingUser.save();

      return NextResponse.json(
        { message: "Email updated successfully", success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid Request Body", success: false },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
