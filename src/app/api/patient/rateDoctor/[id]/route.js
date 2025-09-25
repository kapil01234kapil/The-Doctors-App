import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import notificationModels from "@/models/notificationModels";
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

    const patientUser = await userModels.findById(userId).select("-password");
    if (!patientUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    if (patientUser.role !== "patient") {
      return NextResponse.json(
        { message: "Only Patients Are Authorized To Give Reviews", success: false },
        { status: 403 }
      );
    }

    const { id } = params; // id = Doctor's user ID
    console.log("this is doctors id",id)
    const { rating, feedback,notificationId } = await req.json();

    if (!rating || !feedback) {
      return NextResponse.json(
        { message: "Rating and Feedback are required", success: false },
        { status: 400 }
      );
    }

    const doctorUser = await userModels.findById(id);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return NextResponse.json(
        { message: "Doctor Not Found", success: false },
        { status: 404 }
      );
    }

    doctorUser.reviews.push({
  user: userId, // Patient who is giving the review
  rating,
  name : patientUser?.fullName,
  feedback,
  createdAt: new Date(),
});

// ✅ Recalculate overAllRating
const totalRatings = doctorUser.reviews.reduce((sum, review) => sum + review.rating, 0);
doctorUser.overAllRating = totalRatings / doctorUser.reviews.length;

await notificationModels.findByIdAndUpdate(notificationId, {
  reviewGiven: true,
  isRead: true,
});

await doctorUser.save();


    return NextResponse.json(
      { message: "Review added successfully", success: true, doctor: doctorUser },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error adding review:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
