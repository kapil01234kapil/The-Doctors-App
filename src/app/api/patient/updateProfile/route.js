import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import User from "@/models/userModels";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "No Token Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "No Such User Found", success: false },
        { status: 404 }
      );
    }

    const { fullName, age, gender, contactDetails,address } = await req.json();
    console.log("all the value",fullName,age,gender,contactDetails,address)
    if (!fullName && !age && !gender && !contactDetails && !address) {
      return NextResponse.json(
        {
          message: "Something Should be there to update",
          success: false,
        },
        { status: 400 }
      );
    }
    //Update fields that are provided
    if (fullName) {
      existingUser.fullName = fullName;
    }

    if (age) {
      existingUser.age = age;
    }

    if (gender) {
      existingUser.gender = gender;
    }

    if (contactDetails) {
      existingUser.contactDetails = contactDetails;
    }
    if(address){
      console.log("updated",address)
      existingUser.address = address;
    }
    await existingUser.save();

    return NextResponse.json(
      {
        message: "Profile Updated Successfully",
        success: true,
        user: existingUser,
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
