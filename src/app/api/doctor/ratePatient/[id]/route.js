import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Token is Missing", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const { id } = params; // 👈 no need for await
    const { rating, feedback } = await req.json();

    if (!rating || !feedback) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 400 }
      );
    }

    // Only doctors can receive reviews
    if (existingUser?.role !== "doctor") {
      return NextResponse.json(
        { message: "Not Authorized To Take This Action", success: false },
        { status: 403 }
      );
    }

    // 👇 push new review into array
    existingUser.reviews.push({
      user: id,          // reviewer id
      rating,
      feedback,
      createdAt: new Date(),
    });

    await existingUser.save();

    return NextResponse.json(
      { message: "Review added successfully", success: true, user: existingUser },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error adding review:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
