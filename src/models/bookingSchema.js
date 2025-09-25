import mongoose,{Schema} from "mongoose";

const bookingSchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }, // exact calendar date
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ["waiting", "confirmed", "cancelled"], default: "waiting" }
});

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);