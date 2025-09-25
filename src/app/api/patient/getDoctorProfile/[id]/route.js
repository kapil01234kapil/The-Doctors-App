import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModels";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    console.log("this is user id ",userId)
    if(!userId){
        return NextResponse.json({message : "token is missing",success : false},{status:401})
    }

    const userLoggedIn = await User.findById(userId);
    if(!userLoggedIn){
        return NextResponse.json({message : "User Not Logged In",success : false},{status:404})
    }

    // params.id comes from [id] folder
    const { id } = await params;

    const doctor = await User.findById(id).select("-password");

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, doctor: doctor },{status:200});
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
