import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModels";
import referralModels from "@/models/referralModels";
import { generateUniqueReferralCode } from "@/lib/generateUniqueReferralCode";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, contactDetails, fullName, } = await req.json();

    if (!email || !password || !contactDetails || !fullName) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 401 }
      );
    }
    const referralCode = await generateUniqueReferralCode()
    if(!referralCode){
      return NextResponse.json({message : "Something Went Wrong",success : false},{status:500})
    }
    // generate random 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    // configure transporter once
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_THEDOCTORSAPP,
        pass: process.env.PASSWORD_THEDOCTORSAPP,
      },
    });

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        // Case 1: Already verified → block registration
        return NextResponse.json(
          { message: "User already exists", success: false },
          { status: 400 }
        );
      } else {
        // Case 2: Exists but not verified → update OTP + resend
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUser.password = hashedPassword;
        existingUser.contactDetails = contactDetails;
        existingUser.fullName = fullName;
        existingUser.otp = otp;
        existingUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes validity
        await existingUser.save();

        await transporter.sendMail({
          from: process.env.EMAIL_THEDOCTORSAPP,
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        });

        return NextResponse.json(
          {
            message: "OTP resent to your email. Please verify.",
            success: true,
            user: {
              email: email,
              contactDetails: contactDetails,
              fullName: fullName,
              role: "patient",
              
            },
          },
          { status: 200 }
        );
      }
    }

    // Case 3: New user → create and send OTP
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      contactDetails,
      fullName,
      referralCode : referralCode,
      otp,
      otpExpire: new Date(Date.now() + 10 * 60 * 1000), // ⏰ 10 minutes from now
    });

    await referralModels.create({
      user : newUser._id,
      referralCode,
      
    })

    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_THEDOCTORSAPP,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return NextResponse.json(
      {
        message: "User registered successfully. OTP sent to email.",
        success: true,
        user: {
          email: newUser.email,
          contactDetails: newUser.contactDetails,
          fullName: newUser.fullName,
          role: "patient",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
