import mongoose from "mongoose";
import DoctorWeeklySlot from "./DoctorWeeklySlot.js";

const slotSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const dayScheduleSchema = new mongoose.Schema({
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
  isActive: { type: Boolean, default: false },
  slots: [slotSchema],
  slotDuration: { type: Number, required: true }, // in minutes
});

const doctorScheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    weeklySchedule: [dayScheduleSchema],
    firstSchedule: { type: Boolean, default: true }, // 👈 only true at first creation
  },
  { timestamps: true }
);

// Utility to generate slots
function generateSlots(startTime, endTime, slotDuration) {
  const slots = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let start = new Date(0, 0, 0, startHour, startMinute, 0);
  const end = new Date(0, 0, 0, endHour, endMinute, 0);

  while (start < end) {
    let slotEnd = new Date(start.getTime() + slotDuration * 60000);

    if (slotEnd <= end) {
      slots.push({
        startTime: start.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5),
      });
    }

    start = slotEnd;
  }

  return slots;
}

// Post-save hook: create DoctorWeeklySlots
doctorScheduleSchema.post("save", async function (doc) {
  try {
    let effectiveFrom;

    if (doc.firstSchedule) {
      // First time → effective immediately
      effectiveFrom = new Date();

      // ✅ Now mark firstSchedule = false, but ONLY after first slots created
      await mongoose.model("DoctorSchedule").findByIdAndUpdate(doc._id, {
        firstSchedule: false,
      });
    } else {
      // Subsequent updates → effective after 7 days
      effectiveFrom = new Date();
      effectiveFrom.setDate(effectiveFrom.getDate() + 7);
    }

    const weeklySlots = doc.weeklySchedule
      .filter((daySchedule) => daySchedule.isActive)
      .map((daySchedule) => {
        let expandedSlots = [];
        for (const timeBlock of daySchedule.slots) {
          expandedSlots.push(
            ...generateSlots(
              timeBlock.startTime,
              timeBlock.endTime,
              daySchedule.slotDuration
            )
          );
        }

        return {
          day: daySchedule.day,
          slotDuration: daySchedule.slotDuration,
          slots: expandedSlots,
        };
      });

    if (weeklySlots.length > 0) {
      await DoctorWeeklySlot.create({
        doctor: doc.doctor,
        effectiveFrom,
        allSlot: weeklySlots,
      });
    }

    console.log(
      `✅ Staged new schedule for doctor ${doc.doctor}, effective from ${effectiveFrom}`
    );
  } catch (err) {
    console.error("Error staging weekly slots:", err);
  }
});

const DoctorSchedule =
  mongoose.models.DoctorSchedule ||
  mongoose.model("DoctorSchedule", doctorScheduleSchema);

export default DoctorSchedule;
