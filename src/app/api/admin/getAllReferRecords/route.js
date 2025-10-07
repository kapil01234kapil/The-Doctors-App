import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import referralModels from "@/models/referralModels";
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

    // ✅ Corrected query
    const allReferUser = await referralModels
      .find({ referredUsers: { $exists: true, $ne: [] } })
      .sort({ createdAt: -1 })
      .populate("user", "fullName email role")
      .populate("referredUsers.referredUser", "fullName email role");

    return NextResponse.json({
      message: "All Referred Users Fetched Successfully",
      success: true,
      allReferUser,
    });
  } catch (error) {
    console.log("Error fetching referred users:", error);
    return NextResponse.json(
      { message: "Something Went Wrong", success: false },
      { status: 500 }
    );
  }
}
