import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import User from "@/models/userModels";
import supportModel from "@/models/supportModel"; // Import supportModel
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();

    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await User.findById(userId).select("-password");

    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const { firstName, lastName, email, phoneNumber, supportMessage } = await req.json();

    if (!firstName || !lastName || !email || !phoneNumber || !supportMessage) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 401 }
      );
    }

    const fullName = `${firstName} ${lastName}`;

    // Check if support document already exists for the user
    let supportDoc = await supportModel.findOne({ user: userId });

    if (!supportDoc) {
      // Create new document if not present
      supportDoc = await supportModel.create({
        user: userId,
        fullName,
        email,
        phoneNumber,
        support: [{ message: supportMessage }],
      });
    } else {
      // Append new support message to existing document
      supportDoc.support.push({ message: supportMessage });
      await supportDoc.save();
    }

    return NextResponse.json(
      { message: "Support message saved successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
