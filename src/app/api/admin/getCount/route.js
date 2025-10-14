import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import appointmentModels from "@/models/appointmentModels";
import referralModels from "@/models/referralModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
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
        {
          message: "You Are Not Authorized to get this detail",
          success: false,
        },
        { status: 403 }
      );
    }

    const totalDoctors = await userModels.countDocuments({
      role: "doctor",
      verified: true,
    });

    const totalPatients = await userModels.countDocuments({
      role: "patient",
      verified: true,
    });

    const totalAppointments = await appointmentModels.countDocuments({
      status: { $ne: "pending" },
    });

    const blockedUser = await userModels.countDocuments({ blocked: true });

    // ✅ Updated aggregation — added bonusEarned and amountCredited
    const result = await referralModels.aggregate([
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: "$totalNumberOfReferrals" },
          successfullReferrals: { $sum: "$successfullReferrals" },
          totalBonusEarned: { $sum: "$bonusEarned" },
          totalAmountCredited: { $sum: "$amountCredited" },
        },
      },
    ]);

    const totalReferrals = result[0]?.totalReferrals || 0;
    const successfullReferrals = result[0]?.successfullReferrals || 0;
    const totalBonusEarned = result[0]?.totalBonusEarned || 0;
    const totalAmountCredited = result[0]?.totalAmountCredited || 0;

    const distributedRewards = existingAdmin?.rewards?.rewardsDistributed;
    const pendingRewards = existingAdmin?.rewards?.pendingRewards;

    return NextResponse.json({
      message: "Admin Data Fetched Successfully",
      success: true,
      count: {
        totalDoctors,
        totalPatients,
        blockedUser,
        totalAppointments,
        totalReferrals,
        successfullReferrals,
        totalBonusEarned,      // ✅ added
        totalAmountCredited,   // ✅ added
        distributedRewards,
        pendingRewards,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
