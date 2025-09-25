import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import blockedUserModels from "@/models/blockedUserModels";
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
    if (!existingAdmin || existingAdmin?.role !== "admin") {
      return NextResponse.json(
        { message: "You Are Not Authorized to take this action", success: false },
        { status: 403 }
      );
    }

    const allBlockedUsers = await blockedUserModels.find();
    if (!allBlockedUsers || allBlockedUsers.length === 0) {
      return NextResponse.json(
        { message: "No Blocked user Present at this moment", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "All The Blocked Users Fetched Successfully",
        success: true,
        allBlockedUsers,
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
}
