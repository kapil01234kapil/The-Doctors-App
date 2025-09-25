import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { parseForm } from "@/lib/parseForm";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export const config = {
  api: { bodyParser: false },
};

// 🔧 Extract Cloudinary public_id from a URL
function getPublicIdFromUrl(url) {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts.pop(); // abc123.jpg
  const folderPath = parts.slice(parts.indexOf("upload") + 1).join("/"); // doctors/proofs/identity
  const publicId = folderPath + "/" + filename.split(".")[0]; // doctors/proofs/identity/abc123
  return publicId;
}

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Token is missing" },
        { status: 401 }
      );
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    const { files } = await parseForm(req);

    // ✅ Ensure at least one proof or profile photo is provided
    if (
      !files.identityProof &&
      !files.medicalRegistrationCertificate &&
      !files.propertyProof &&
      !files.profilePhoto
    ) {
      return NextResponse.json(
        { success: false, message: "At least one proof is required" },
        { status: 400 }
      );
    }

    const uploadOptions = {
      folder: "doctors/proofs",
      quality: "auto:eco",
      fetch_format: "auto",
    };

    const proofsToSave = { ...existingUser.doctorsProfile.proofs.toObject?.() };

    /* ✅ Handle Profile Photo (directly on user) */
    if (files.profilePhoto) {
      if (existingUser.profilePhoto) {
        const oldId = getPublicIdFromUrl(existingUser.profilePhoto);
        if (oldId) await cloudinary.uploader.destroy(oldId);
      }
      const uploadRes = await cloudinary.uploader.upload(
        files.profilePhoto[0].filepath,
        { ...uploadOptions, folder: "doctors/profilePhoto" }
      );
      existingUser.profilePhoto = uploadRes.secure_url; // 🔥 saved directly in user
    }

    /* ✅ Handle Identity Proof */
    if (files.identityProof) {
      if (proofsToSave.identityProof) {
        const oldId = getPublicIdFromUrl(proofsToSave.identityProof);
        if (oldId) await cloudinary.uploader.destroy(oldId);
      }
      const uploadRes = await cloudinary.uploader.upload(
        files.identityProof[0].filepath,
        { ...uploadOptions, folder: "doctors/proofs/identity" }
      );
      proofsToSave.identityProof = uploadRes.secure_url;
    }

    /* ✅ Handle Medical Registration Certificate */
    if (files.medicalRegistrationCertificate) {
      if (proofsToSave.medicalRegistrationProof) {
        const oldId = getPublicIdFromUrl(proofsToSave.medicalRegistrationProof);
        if (oldId) await cloudinary.uploader.destroy(oldId);
      }
      const uploadRes = await cloudinary.uploader.upload(
        files.medicalRegistrationCertificate[0].filepath,
        { ...uploadOptions, folder: "doctors/proofs/medical" }
      );
      proofsToSave.medicalRegistrationProof = uploadRes.secure_url;
    }

    /* ✅ Handle Property Proof */
    if (files.propertyProof) {
      if (proofsToSave.propertyProof) {
        const oldId = getPublicIdFromUrl(proofsToSave.propertyProof);
        if (oldId) await cloudinary.uploader.destroy(oldId);
      }
      const uploadRes = await cloudinary.uploader.upload(
        files.propertyProof[0].filepath,
        { ...uploadOptions, folder: "doctors/proofs/property" }
      );
      proofsToSave.propertyProof = uploadRes.secure_url;
    }

    // ✅ Save back to DB
    existingUser.doctorsProfile.proofs = proofsToSave;
    existingUser.doctorsProfile.profileSubmitted = true;
    await existingUser.save();

    return NextResponse.json({
      success: true,
      message: "Proof(s) uploaded successfully",
      profilePhoto: existingUser.profilePhoto,
      proofs: existingUser.doctorsProfile.proofs,
    });
  } catch (error) {
    console.error("Doctor proofs upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
