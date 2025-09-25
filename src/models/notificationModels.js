import mongoose,{Schema} from "mongoose"

const notificationSchema = new Schema({
    message : {
        type : String,
        max : 200,
        min : 5,
    },
    highPriority : {
        type : Boolean,
        default : false
    },
    title : {
        type : String,
        max : 50,
        min : 4
    },
    reciever : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    sender : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    type : {
        type : String,
        enum : ["Payment","Appointment","General","Feedback"]
    },
    isRead : {
        type : Boolean,
        default : false
    },
    reviewGiven : {
        type : Boolean,
    }
    
},{timestamps : true})

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
