import mongoose from "mongoose";
import referralModels from "../models/referralModels.js";
import { connectDB } from "../lib/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Explicitly define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("MONGO_URI:", process.env.MONGO_URI); // Should now print your Mongo URI

async function addReferredDateToAllRecords() {
  try {
    await connectDB();

    const allReferralDocs = await referralModels.find({});

    for (const doc of allReferralDocs) {
      let modified = false;

      doc.referredUsers = doc.referredUsers.map((refUser) => {
        if (!refUser.referredDate) {
          refUser.referredDate = Date.now();
          modified = true;
        }
        return refUser;
      });

      if (modified) {
        await doc.save();
        console.log(`Updated referral doc: ${doc._id}`);
      }
    }

    console.log("All referral records updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating referral records:", error);
    process.exit(1);
  }
}

addReferredDateToAllRecords();
