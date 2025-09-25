import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB()
    const userId = await getUserIdFromRequest();
    console.log("userid",userId)
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "No Such User Found" },
        { status: 404 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Both current and new password are required" },
        { status: 400 }
      );
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect Current Password", success: false },
        { status: 401 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    existingUser.password = await bcrypt.hash(newPassword, salt);

    await existingUser.save();

    return NextResponse.json(
      { success: true, message: "Password Changed Successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
