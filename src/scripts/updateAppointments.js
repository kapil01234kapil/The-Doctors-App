import { connectDB } from "../lib/db.js";
import appointmentModels from "../models/appointmentModels.js";
import dotenv from "dotenv";

dotenv.config({});

const updateAppointments = async () => {
  try {
    await connectDB();

    // Update all documents where isCompleted is missing
    const result = await appointmentModels.updateMany(
      { isCompleted: { $exists: false } },
      { $set: { isCompleted: false } }
    );

    console.log(`✅ Updated ${result.modifiedCount} appointments`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating appointments:", error);
    process.exit(1);
  }
};

updateAppointments();
