import mongoose, { Schema } from "mongoose";

const referralSchema = new Schema({
  
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  referralCode: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  referKrneWaala : {
    type : Schema.Types.ObjectId,
    ref : "User"
  },
  totalNumberOfReferrals : {
    type : Number,
    default : 0
  },
  successfullReferrals : {
    type : Number,
    default : 0
  },
  bonusEarned: {
    type: Number,
    default: 0, // total bonus in rupees
  },
  amountCredited : {
    type: Number,
    default: 0,
  },
  referredUsers: [
    {
      referredUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      referredDate : {
        type : Date
      },
      numberOfAppointment: {
        type: Number,
        default: 0,
      },
      
      bonusCredited: {
        type: Boolean,
        default: false,
      },
      status : {
        type : String,
        enum : ["Completed","Pending","Successfull"],
        default : "Pending"
      }
    },
  ],
}, { timestamps: true });

export default mongoose.models.Referral || mongoose.model("Referral", referralSchema);
