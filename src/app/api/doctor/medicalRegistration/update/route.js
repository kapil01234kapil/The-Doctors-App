import { connectDB } from "@/lib/db";
import User from "@/models/userModels";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { NextResponse } from "next/server";

export async function PUT(req) {
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
      completionOfDegree,
      qualifications,
      specializations,
      experience,
    } = await req.json();
    console.log(
      registrationNumber,
      registrationCouncil,
      institute,
      completionOfDegree,
      specializations,
      experience
    );
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

    // ✅ update essentials (only if provided)
    if (registrationNumber)
      user.doctorsProfile.essentials.registrationNumber = registrationNumber;
    if (registrationCouncil)
      user.doctorsProfile.essentials.registrationCouncil = registrationCouncil;
    if (institute) user.doctorsProfile.essentials.institute = institute;
    if (completionOfDegree)
      user.doctorsProfile.essentials.completionOfDegree = completionOfDegree;

    // ✅ update qualifications, specializations, experience
    if (qualifications) {
      user.doctorsProfile.qualifications = Array.isArray(qualifications)
        ? qualifications
        : [qualifications];
    }

    if (specializations) {
      user.doctorsProfile.specializations = specializations;
    }

    if (experience !== undefined) {
      user.doctorsProfile.experience = Number(experience);
    }

    // Keep verificationStatus unchanged unless first submission
    if (
      !user.doctorsProfile.verificationStatus ||
      user.doctorsProfile.verificationStatus === "Pending"
    ) {
      user.doctorsProfile.verificationStatus = "Submitted";
    }

    await user.save();
    console.log("user saved line is done ");
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
