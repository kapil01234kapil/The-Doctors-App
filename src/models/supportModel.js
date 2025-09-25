import mongoose, { Schema } from "mongoose";

const supportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    phoneNumber: {
      type: String,
      required: true,
      set: (v) => String(v).replace(/\s+/g, "").trim(), // strip spaces
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },

    support: [
      {
        message: { type: String, required: true },
        timeOfMessage: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const supportModel =
  mongoose.models.Support || mongoose.model("Support", supportSchema);

export default supportModel;
