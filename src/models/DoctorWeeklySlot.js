import mongoose, { Schema } from "mongoose";

const slotSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  patientName: { type: String },
  status: {
    type: String,
    enum: ["waiting", "confirmed", "cancelled", "free"],
    default: "free",
  },
  isPending: { type: Date },
});

const doctorWeeklySlotSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    effectiveFrom: {
      type: Date,
      required: true, // 🔑 date when this version becomes active
    },
    allSlot: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        slotDuration: {
          type: Number,
          enum: [15, 30, 45, 60],
          required: true,
          default : 30
        },
        slots: [slotSchema],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.DoctorWeeklySlot ||
  mongoose.model("DoctorWeeklySlot", doctorWeeklySlotSchema);
