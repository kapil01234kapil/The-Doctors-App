import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { Finance } from "@/models/financeModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        await connectDB();
        const userId = await getUserIdFromRequest();
        if(!userId){
            return NextResponse.json({message: "Unauthorized",success : false}, {status: 401})
        }

        const existingUser = await userModels.findById(userId).select("-password");
        if(!existingUser){
            return NextResponse.json({message: "User not found",success : false}, {status: 404})
        }

        const financialRecords = await Finance.find({doctor: userId}).sort({createdAt: -1}).populate("appointments");
        if(!financialRecords || financialRecords.length === 0){
            return NextResponse.json({message: "No financial records found",success : false}, {status: 404})
        }
        return NextResponse.json({message: "Financial records fetched successfully",success : true,  financialRecords}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error",success : false}, {status: 500})
    }
}