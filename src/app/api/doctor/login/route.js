import { connectDB } from "@/lib/db";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    if(existingUser.role !== "doctor"){
      return NextResponse.json({message : "You Are Not Allowed To Login With This Role",success : false},{status:401})
    }
    if(existingUser?.blocked){
      return NextResponse.json({message : "You Have Been Blocked From The Platform By The Admin",success : false},{status : 403})
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid Credentials", success: false },
        { status: 401 }
      );
    }

    // Remove password before sending back
    const userWithoutPassword = await User.findById(existingUser._id).select(
      "-password"
    );

    // Generate JWT for ALL users (verified or not)
    const token = jwt.sign(
      { userId: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare response
    let response;

    // Case 1: Doctor not verified yet
    if (!existingUser?.doctorsProfile?.verifiedDoctor) {
      response = NextResponse.json(
        {
          success: true,
          message: "Complete The Verification Process",
          user: userWithoutPassword,
          verificationStatus:
            existingUser.doctorsProfile?.status || "not_submitted",
          token,
        },
        { status: 202 } // Accepted but needs verification
      );
    } else {
      // Case 2: Verified doctor or normal user
      response = NextResponse.json(
        {
          message: "Login Successful",
          success: true,
          token,
          user: userWithoutPassword,
        },
        { status: 200 }
      );
    }

    // Always set cookie so unverified users also get userId
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 , // 7 days
      path: "/",
    });

      response.cookies.set("role", existingUser.role, {
  httpOnly: false, // role can be read by middleware/client
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
});

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
