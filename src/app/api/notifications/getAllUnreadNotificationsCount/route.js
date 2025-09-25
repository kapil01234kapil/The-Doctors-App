import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import notificationModels from "@/models/notificationModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        
        await connectDB();

        const userId = await getUserIdFromRequest();
        if (!userId) {
            return NextResponse.json(
                { message: "No Token Found", success: false },
                { status: 401 }
            );
        }

        const existingUser = await userModels.findById(userId).select("-password");
        if (!existingUser) {
            return NextResponse.json(
                { message: "User Not Found", success: false },
                { status: 404 }
            );
        }

        const unreadCount = await notificationModels.countDocuments({
            reciever: userId,
            isRead: false
        });


        console.log("this is the count",unreadCount)
        return NextResponse.json({
            message : "Count Of Unread Notifications Fetched Properly",
            success: true,
            unreadCount: unreadCount
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
}
