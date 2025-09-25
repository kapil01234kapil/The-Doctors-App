import mongoose from "mongoose";
import userModels from "../models/userModels.js";
import { connectDB } from "../lib/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("MONGO_URI:", process.env.MONGO_URI);

async function addAddressToPatients() {
  try {
    await connectDB();

    const result = await userModels.updateMany(
      { role: "patient", address: { $exists: false } }, // only patients without address
      { $set: { address: "" } } // default empty string (you can change to null if preferred)
    );

    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    console.log("Address field added successfully to all patient profiles.");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addAddressToPatients();
