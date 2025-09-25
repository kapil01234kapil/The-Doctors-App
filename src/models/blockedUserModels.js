import mongoose, { Schema } from "mongoose";

const blockedUserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    reasonForBlocking: {
      type: String,
      minlength: 10,
      maxlength: 1000,
    },
    blockedDate: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["doctor", "patient"],
    },
    phoneNumber: {
      type: String,
      required: true,
      set: (v) => (v ? String(v).replace(/\s+/g, "").trim() : v),
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlockedUser ||
  mongoose.model("BlockedUser", blockedUserSchema);
