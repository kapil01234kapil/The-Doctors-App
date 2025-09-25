import { connectDB } from "@/lib/db";
import User from "@/models/userModels";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    console.log("User ID from request:", userId);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const {
      registrationNumber,
      registrationCouncil,
      institute,
      instituteLocation,
      completionOfDegree,
      qualifications,
      specializations,
      experience,

    } = await req.json();

    if (
      !registrationNumber ||
      !registrationCouncil ||
      !institute ||
      !instituteLocation||
      !completionOfDegree ||
      !qualifications ||
      !specializations ||
      experience === undefined
    ) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    if (user.role !== "doctor") {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 403 }
      );
    }

    // ✅ save essentials
    user.doctorsProfile.essentials = {
      registrationNumber,
      registrationCouncil,
      institute,
      instituteLocation,
      completionOfDegree,
    };

    // ✅ save qualifications, specializations, and experience
    user.doctorsProfile.qualifications = Array.isArray(qualifications)
      ? qualifications
      : [qualifications];

    user.doctorsProfile.specializations = specializations

    user.doctorsProfile.experience = Number(experience);

    // optional: when submitting verification details for first time
    user.doctorsProfile.verificationStatus = "Submitted";

    await user.save();

    return NextResponse.json(
      {
        message: "Doctor's profile updated successfully",
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor's profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
