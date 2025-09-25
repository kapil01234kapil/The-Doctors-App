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

    const deletedNotifications = await notificationModels.deleteMany({
      receiver: userId,
    });

    if (deletedNotifications.deletedCount === 0) {
      return NextResponse.json(
        { message: "No Notifications Found To Be Deleted", success: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "All The Notifications of this user deleted Successfully",
        success: true,
        deletedCount: deletedNotifications.deletedCount,
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
