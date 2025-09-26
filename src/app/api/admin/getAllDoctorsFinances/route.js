import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { Finance } from "@/models/financeModel";
import { NextResponse } from "next/server";

export async function GET(request) {
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
    if (!existingAdmin || existingAdmin?.role !== "admin") {
      return NextResponse.json(
        {
          message: "You Are Not Authorized to take this action",
          success: false,
        },
        { status: 403 }
      );
    }

    // Fetch all finance records sorted by weekEnd descending
    const allFinanceRecords = await Finance.find()
      .sort({ weekEnd: -1 })
      .populate({
        path: "doctor",
        select: "fullName profilePhoto email contactDetails"
      })
      .lean();

    // Filter to get only the latest record for each doctor
    const latestFinanceRecordsMap = new Map();

    for (const record of allFinanceRecords) {
      const doctorId = record.doctor._id.toString();
      if (!latestFinanceRecordsMap.has(doctorId)) {
        latestFinanceRecordsMap.set(doctorId, record);
      }
    }

    const latestFinanceRecords = Array.from(latestFinanceRecordsMap.values());

    return NextResponse.json({
        message: "Latest Finance Records fetched successfully",
      success: true,
       latestFinanceRecords
    }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
