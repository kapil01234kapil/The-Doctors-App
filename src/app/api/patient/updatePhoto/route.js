import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { parseForm } from "@/lib/parseForm";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token is missing", success: false },
        { status: 404 }
      );
    }

    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    const { files } = await parseForm(req);

    if (!files.profilePhoto) {
      return NextResponse.json(
        { error: "Profile photo is required" },
        { status: 400 }
      );
    }

    // ✅ Step 1: Delete old profile photo if exists
    if (existingUser.profilePhoto) {
      try {
        const oldUrl = existingUser.profilePhoto;
        const parts = oldUrl.split("/");
        const publicIdWithExt = parts[parts.length - 1]; // e.g. "abc123.jpg"
        const publicId = "patients/profile_photos/" + publicIdWithExt.split(".")[0]; // remove extension

        await cloudinary.uploader.destroy(publicId);
        console.log("🗑️ Deleted old photo:", publicId);
      } catch (err) {
        console.warn("⚠️ Failed to delete old profile photo:", err.message);
      }
    }

    // ✅ Step 2: Upload new photo
    const result = await cloudinary.uploader.upload(
      files.profilePhoto[0].filepath,
      {
        folder: "patients/profile_photos",
        quality: "auto:eco",
        fetch_format: "auto",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
        ],
      }
    );

    // ✅ Step 3: Save new photo in DB
    existingUser.profilePhoto = result.secure_url;
    await existingUser.save();

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      profilePhoto: existingUser.profilePhoto,
      message : "Profile Photo Updated Successfullt"
    },{status : 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
