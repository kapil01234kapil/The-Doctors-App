import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModels";
import DoctorSchedule from "@/models/DoctorSchedule";
import { generateUniqueReferralCode } from "@/lib/generateUniqueReferralCode";
import referralModels from "@/models/referralModels";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, contactDetails, fullName, city,couponCode } =
      await req.json();

    if (!email || !password || !contactDetails || !fullName || !city) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 401 }
      );
    }
    const referralCode = await generateUniqueReferralCode();
    if (!referralCode) {
      return NextResponse.json(
        { message: "Something Went Wrong", success: false },
        { status: 500 }
      );
    }
    // generate random 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    // setup email transporter once
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_NEXTCONNECTHUB,
        pass: process.env.PASSWORD_NEXTCONNECTHUB,
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
        existingUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await existingUser.save();

        await transporter.sendMail({
          from: process.env.EMAIL_NEXTCONNECTHUB,
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        });

        return NextResponse.json(
          {
            message: "OTP resent to your email. Please verify.",
            success: true,
            user: {
              email,
              contactDetails,
              fullName,
              role: "doctor",
            },
          },
          { status: 200 }
        );
      }
    }

    // Case 3: New user → create new user with OTP
    const hashedPassword = await bcrypt.hash(password, 10);

    await transporter.sendMail({
      from: process.env.EMAIL_NEXTCONNECTHUB,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    const newUser = new User({
      email,
      password: hashedPassword,
      contactDetails,
      fullName,
      doctorsProfile: {
        clinic: [
          {
            city: city, // 👈 save city here
          },
        ],
      },
      otp,
      otpExpire: new Date(Date.now() + 10 * 60 * 1000),
      role: "doctor",
      referralCode: referralCode,
    });

    await newUser.save();
    await DoctorSchedule.create({
      doctor: newUser._id,
      weeklySchedule: [
        { day: "Monday", isActive: false, slots: [], slotDuration: 30 },
        { day: "Tuesday", isActive: false, slots: [], slotDuration: 30 },
        { day: "Wednesday", isActive: false, slots: [], slotDuration: 30 },
        { day: "Thursday", isActive: false, slots: [], slotDuration: 30 },
        { day: "Friday", isActive: false, slots: [], slotDuration: 30 },
        { day: "Saturday", isActive: false, slots: [], slotDuration: 30 },
        { day: "Sunday", isActive: false, slots: [], slotDuration: 30 },
      ],
    });
    await referralModels.create({
      user: newUser._id,
      referralCode,
    });

  if (couponCode) {
  const referrerReferralDoc = await referralModels.findOne({
    referralCode: couponCode,
  });

  if (referrerReferralDoc) {
    referrerReferralDoc.referredUsers.push({
      referredUser: newUser._id,
      referredDate: Date.now(),
    });
    referrerReferralDoc.totalNumberOfReferrals += 1;

    await referrerReferralDoc.save();
  }
}

    return NextResponse.json(
      {
        message: "User registered successfully. OTP sent to email.",
        success: true,
        user: {
          email,
          contactDetails,
          fullName,
          role: "doctor",
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
