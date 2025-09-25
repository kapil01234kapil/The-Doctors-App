import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import notificationModels from "../models/notificationModels.js";

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("MONGO_URI:", process.env.MONGO_URI);

async function fixNotificationFields() {
  try {
    await connectDB();

    // Set isRead to false where missing
    const isReadResult = await notificationModels.updateMany(
      { isRead: { $exists: false } },
      { $set: { isRead: false } }
    );

    console.log(`isRead - Matched: ${isReadResult.matchedCount}, Modified: ${isReadResult.modifiedCount}`);

    // Set title to "Appointment Confirmed" where missing
    const titleResult = await notificationModels.updateMany(
      { title: { $exists: false } },
      { $set: { title: "Appointment Confirmed" } }
    );

    console.log(`title - Matched: ${titleResult.matchedCount}, Modified: ${titleResult.modifiedCount}`);

    console.log("Notification documents updated successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixNotificationFields();
