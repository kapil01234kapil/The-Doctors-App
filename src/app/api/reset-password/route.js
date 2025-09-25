import { connectDB } from "@/lib/db";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { newPassword, confirmPassword, token } = await req.json();
    console.log(newPassword,confirmPassword,token)
    if (!newPassword || !confirmPassword || !token) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match", success: false },
        { status: 400 }
      );
    }

    // ✅ find user by reset token
    const existingUser = await userModels.findOne({ resetPasswordToken: token });
    if (!existingUser) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 404 }
      );
    }

    // ✅ hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ update user
    existingUser.password = hashedPassword;
    existingUser.resetPasswordToken = undefined; // clear token
    existingUser.resetPasswordExpire = undefined; // if you stored expiry
    await existingUser.save();

    return NextResponse.json(
      { message: "Password reset successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
