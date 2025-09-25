import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import blockedUserModels from "@/models/blockedUserModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const userId = await getUserIdFromRequest();
        if (!userId) {
            return NextResponse.json(
                { message: "Token Missing", success: false },
                { status: 401 }
            );
        }

        const existingAdmin = await userModels.findById(userId).select("-password");
        if (!existingAdmin || existingAdmin.role !== "admin") {
            return NextResponse.json(
                { message: "You Are Not Authorized to take this action", success: false },
                { status: 403 }
            );
        }

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json(
                { message: "Something is Missing", success: false },
                { status: 400 }
            );
        }

        const unblockedUser = await userModels.findByIdAndUpdate(id, { blocked: false });
        if (!unblockedUser) {
            return NextResponse.json(
                { message: "User Cannot Be Unblocked", success: false },
                { status: 400 }
            );
        }

       const deletedUser = await blockedUserModels.findOneAndDelete({ userId: id });
if (!deletedUser) {
  return NextResponse.json(
    { message: "User Model Cannot Be Blocked", success: false },
    { status: 400 }
  );
}

        return NextResponse.json(
            { message: `${unblockedUser.fullName} unblocked Successfully`, success: true,deletedUser },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
};
