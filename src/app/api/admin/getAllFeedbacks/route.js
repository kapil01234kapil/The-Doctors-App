import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import feedbackModels from "@/models/feedbackModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Missing", success: false },
        { status: 401 }
      );
    }

    const existingAdmin = await userModels.findById(userId).select("-password");
    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json(
        {
          message: "You Are Not Authorized to get this detail",
          success: false,
        },
        { status: 403 }
      );
    }

    const getAllFeedbacks = await feedbackModels
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "role profilePhoto" });

    if (!getAllFeedbacks || getAllFeedbacks.length === 0) {
      return NextResponse.json(
        { message: "No Feedback Present At This Moment", success: false ,getAllFeedbacks},
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "All The Feedbacks Fetched Properly",
        success: true,
        feedbacks: getAllFeedbacks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
