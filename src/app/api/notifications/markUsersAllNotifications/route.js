import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import notificationModels from "@/models/notificationModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
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

    const updatedNotifications = await notificationModels.updateMany(
      { reciever: userId, isRead: false }, // match schema field spelling
      { $set: { isRead: true } }
    );

    if (updatedNotifications.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No notifications were updated", success: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "All notifications marked as read",
        success: true,
        modifiedCount: updatedNotifications.modifiedCount,
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
