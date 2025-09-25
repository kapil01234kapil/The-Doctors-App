import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import DoctorSchedule from "@/models/DoctorSchedule";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export  async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest(req);
    console.log("Authenticated User ID:", userId);  
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const doctorsSchedule = await DoctorSchedule.findOne({ doctor: userId });
    if (!doctorsSchedule) {
      return NextResponse.json(
        { message: "Doctor Schedule Not Found", success: false },
        { status: 404 }
      );
    }

    const {
      age,
      clinicAddress,
      state,
      consultationFees,
      gender,
      slotDuration,
      weeklySchedule,
      clinicName
    } = await req.json();
    console.log("Received Data:", {
      age,
      clinicAddress,
      state,
      consultationFees,
      gender,
      slotDuration,
      weeklySchedule,
      clinicName
    });

    // do NOT use simple falsy checks; allow 0 and false
    if (
      age === undefined ||
      clinicAddress === undefined ||
      state === undefined ||
      consultationFees === undefined ||
      gender === undefined ||
      slotDuration === undefined ||
      !weeklySchedule || 
      !clinicName
    ) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 400 }
      );
    }

    // --- Update User fields ---
    existingUser.age = Number(age);
    existingUser.gender = gender;
    

    // ensure doctorsProfile exists
    if (!existingUser.doctorsProfile) existingUser.doctorsProfile = {};

    // set nested doctorsProfile fields correctly
    existingUser.doctorsProfile.consultationFees = Number(consultationFees);

    // clinic is an array; ensure index 0 exists, then set clinicAddress
    if (!Array.isArray(existingUser.doctorsProfile.clinic)) {
      existingUser.doctorsProfile.clinic = [];
    }
    if (!existingUser.doctorsProfile.clinic[0]) {
      existingUser.doctorsProfile.clinic[0] = {};
    }
    existingUser.doctorsProfile.clinic[0].state = state;

      if (!existingUser.doctorsProfile.clinic[0]) {
      existingUser.doctorsProfile.clinic[0] = {};
    }
    existingUser.doctorsProfile.clinic[0].state = state;
    existingUser.doctorsProfile.clinic[0].clinicName = clinicName

    // --- Update DoctorSchedule ---
    // expect weeklySchedule as array of { day, isActive, slots: [{startTime,endTime,isBooked?}], slotDuration? }
    // apply top-level slotDuration to each day if missing/override
    doctorsSchedule.weeklySchedule = (Array.isArray(weeklySchedule) ? weeklySchedule : []).map(
      (d) => ({
        day: d.day,
        isActive: Boolean(d.isActive),
        slotDuration:
          d.slotDuration !== undefined
            ? Number(d.slotDuration)
            : Number(slotDuration),
        slots: Array.isArray(d.slots)
          ? d.slots.map((s) => ({
              startTime: s.startTime,
              endTime: s.endTime,
              isBooked: Boolean(s.isBooked),
            }))
          : [],
      })
    );

    await doctorsSchedule.save();

// --- Link DoctorSchedule to User ---
if (
  !existingUser.weeklySchedule ||
  existingUser.weeklySchedule.toString() !== doctorsSchedule._id.toString()
) {
  existingUser.weeklySchedule = doctorsSchedule._id;
}

await existingUser.save();

    return NextResponse.json(
      { message: "Doctor profile & schedule updated", success: true ,existingUser, weeklySchedule:doctorsSchedule.weeklySchedule},
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
