import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import notificationModels from "@/models/notificationModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest(req);
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

    const { notificationId } = await req.json();
    console.log("this is notification id ")
    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required", success: false },
        { status: 400 }
      );
    }

    // Ensure the notification belongs to the logged-in user
    const deletedNotification = await notificationModels.findOneAndDelete({
      _id: notificationId,
      reciever: userId,
    });

    if (!deletedNotification) {
      return NextResponse.json(
        { message: "Notification not found or not authorized", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notification Deleted Successfully", success: true },
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
