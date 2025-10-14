import mongoose from "mongoose";
import User from "../models/userModels.js"; // ✅ use correct relative path
import { connectDB } from "../lib/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("MONGO_URI:", process.env.MONGO_URI);

async function addTotalAppointmentsField() {
  try {
    await connectDB();

    // ✅ Update all doctors who don’t yet have the field
    const result = await User.updateMany(
      { 
        role: "doctor",
        "doctorsProfile.totalNumberOfAppointments": { $exists: false } 
      },
      { 
        $set: { "doctorsProfile.totalNumberOfAppointments": 0 } 
      }
    );

    console.log(`✅ Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    console.log("totalNumberOfAppointments field added successfully for all doctor profiles.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating doctor profiles:", error);
    process.exit(1);
  }
}

addTotalAppointmentsField();
