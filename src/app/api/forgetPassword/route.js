import { connectDB } from "@/lib/db";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email must be entered", success: false },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email }).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "No user registered with this email" },
        { status: 404 }
      );
    }

    // ✅ CASE 1: No OTP received → Generate & send OTP
    if (!otp) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);

      existingUser.otp = generatedOtp;
      existingUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins expiry
      await existingUser.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_THEDOCTORSAPP,
          pass: process.env.PASSWORD_THEDOCTORSAPP,
        },
      });

      const mailOptions = {
        from: `"Doctors Online" <${process.env.EMAIL_NEXTCONNECTHUB}>`,
        to: email,
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is: <b>${generatedOtp}</b></p>
               <p>This OTP is valid for 10 minutes.</p>`,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json(
        { success: true, message: "OTP sent to your email",user:{email: email} },
        { status: 200 }
      );
    }

    // ✅ CASE 2: OTP received → Verify OTP
    if (otp) {
      if (
        existingUser.otp !== parseInt(otp) ||
        existingUser.otpExpire < Date.now()
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      // Clear OTP after successful verification
      existingUser.otp = undefined;
      existingUser.otpExpire = undefined;

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString("hex");

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins expiry
      await existingUser.save();

      return NextResponse.json(
        {
          success: true,
          message: "OTP verified, reset token generated",
          resetPasswordToken: resetToken, // 👈 return this for frontend dynamic route
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
