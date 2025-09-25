import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import feedbackModels from "@/models/feedbackModels";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Token Not Found" },
        { status: 401 }
      );
    }
    console.log("This is the user id:", userId);

    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    const { name, email, feedback } = await req.json();
    console.log(name,email,feedback)
    if (!name || !email || !feedback) {
      return NextResponse.json(
        { message: "Something is missing", success: false },
        { status: 401 }
      );
    }

    let feedbackDoc = await feedbackModels.findOne({ user : userId });

    if (!feedbackDoc) {
      // Create a new feedback document if none exists for the email
      feedbackDoc = await feedbackModels.create({
        user : userId,
        fullName : name,
        email,
        feedback: [{ message : feedback }],
      });
    } else {
      // Append to existing feedback array
      feedbackDoc.feedback.push({ message : feedback });
      await feedbackDoc.save();
    }

    return NextResponse.json(
      { message: "Feedback saved successfully", success: true },
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
