import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["cancelled", "confirmed","pending","completed"],
      default: "pending",
    },
    pendingTime : {
      type : Date,
      default : Date.now
    },
    fees : {
      type : Number,
      default : 0
    },
    paymentStatus : {
      type : String,
      enum : ["pending","confirmed","refunded"]
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clinicAddress : {
      type : String
    },
    appointmentDate: {
      type: Date,
      required: true, // exact date & time of appointment
    },
    appointmentDay : {type : String,required : true},
    bookedSlot : {type : String, required : true},
    notes: {
      type: String,
      maxlength: 500,
    },
    patientProfile : {
      name : {
        type : String,
      },
      phoneNumber : {
        type : Number
      },
      age : {
        type : Number
      },
      gender : {
        type : String,
      }
    },
    consultationFees : {
      type : Number
    },
    cancelledBy: {
      type: String,
      enum: ["patient", "doctor", null],
      default: null,
    },
    isCompleted : {
      type : Boolean,
      default : false
    },
    message : {
      type : String,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
