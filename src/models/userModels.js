import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 35,
    },
    password: {
      type: String,
      required: true,
      min: 4,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: true,
    },
    recoveryEmail: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    tempEmail: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    otpExpire: {
      type: Date,
    },
    doctorsProfile: {
      type: new Schema(
        {
          clinic: [
            {
              city: {
                type: String,
              },
              state: {
                type: String,
              },
              clinicAddress: { type: String },
              ownership: {
                type: String,
              },
              clinicName: {
                type: String,
              },
            },
          ],
          verifiedDoctor: {
            type: Boolean,
            default: false,
          },
          earning : {
            type : Number,
            default : 0
          },
          verificationStatus: {
            type: String,
            enum: ["Submitted", "Rejected", "Pending"],
            default: "Pending",
          },
          languagesSpoken : [
            {type : String}
          ],
          patientsTreated : {
            type : Number,
            default : 0
          },
          essentials: {
            registrationNumber: { type: Number },
            registrationCouncil: { type: String },
            institute: { type: String },
            instituteLocation : {type : String},
            completionOfDegree: {
              type: Number,
            },

          },

          profileSubmitted: {
            type: Boolean,
            default: false,
          },

          qualifications: {
            type: [String],
            default: [],
          },
          specializations: {
            type: String,
          },
          experience: {
            type: Number,
            min: 0,
          },

          weeklySchedule: {
            type: Schema.Types.ObjectId,
            ref: "DoctorSchedule",
          },

          totalNumberOfAppointments : {
            type : Number,
            default : 0
          },
          consultationFees: {
            type: Number,
            min: 0,
          },
          proofs: {
            identityProof: {
              type: String,
            },
            propertyProof: {
              type: String,
            },
            medicalRegistrationProof: {
              type: String,
            },
          },
        },
        { _id: false } // prevents creation of extra _id for subdocument
      ),
      required: function () {
        return this.role === "doctor";
      },
    },

    profilePhoto: String,

    age: Number,
    address : {
      type : String
    },
    medicalHistory: [String],
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    spamBooking: {
      count: {
        type: Number,
        default: 0,
      },
      firstAttemptAt: {
        type: Date,
        default: null,
      },
    },

    resetPasswordToken: { type: String, default: null },
    resetPasswordTokenExpiry: { type: Date, default: null },
    contactDetails: {
      type: String,
      required: true,
      set: (v) => String(v).replace(/\s+/g, "").trim(), // strip spaces
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },

    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        name : {type : String},
        rating: { type: Number, min: 1, max: 5, required: true },
        feedback: { type: String, maxlength: 300 },
        createdAt: { type: Date, default: Date.now }, // 👈 auto set when review is added
      },
    ],
    overAllRating : {
      type : Number,
    },
    referralCode : {
      type : String
    },
    successfullAppointments : {
      type : Number,
    },
    blocked : {
      type : Boolean,
      default : false
    },
    rewards : {
      rewardsDistributed : {
        type : Number
      },
      rewardsPending : {
        type : Number
      }
    },
    upiId : {
      type : String,
      match: [/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/
, "Please enter a valid UPI ID"],
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
