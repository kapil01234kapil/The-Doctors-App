import mongoose, { Schema } from "mongoose";

const financeSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    totalAmount: { type: Number, default: 0 },
    platformFees: { type: Number, default: 0 },
    payableAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "cleared"], default: "pending" },
  },
  { timestamps: true }
);

export const Finance =
  mongoose.models.Finance || mongoose.model("Finance", financeSchema);
