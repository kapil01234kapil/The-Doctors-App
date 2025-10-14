import mongoose from "mongoose";
import Referral from "../models/referralModels.js"; // ✅ use relative path
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

async function addAmountCreditedToReferrals() {
  try {
    await connectDB();

    const result = await Referral.updateMany(
      { amountCredited: { $exists: false } },
      { $set: { amountCredited: 0 } }
    );

    console.log(`✅ Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    console.log("amountCredited field added successfully to all referral records.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating referrals:", error);
    process.exit(1);
  }
}

addAmountCreditedToReferrals();
