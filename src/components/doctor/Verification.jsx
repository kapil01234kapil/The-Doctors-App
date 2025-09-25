"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { X, Plus, Clock, Loader2 } from "lucide-react";
import { setUser } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { setWeeklySchedule } from "@/redux/scheduleSlice";
// import { updateDoctorProfile } from "@/store/authSlice"; // replace with your slice action

export default function DoctorVerification() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { weeklySchedule } = useSelector((store) => store.schedule);
  console.log("weeklySchedule from store:", weeklySchedule);
  const [step, setStep] = useState(1);
  const [savedSteps, setSavedSteps] = useState({
    1: !!(
      user?.doctorsProfile?.essentials?.registrationNumber &&
      user?.doctorsProfile?.essentials?.registrationCouncil &&
      user?.doctorsProfile?.essentials?.institute &&
      user?.doctorsProfile?.essentials?.completionOfDegree &&
      user?.doctorsProfile?.qualifications?.length &&
      user?.doctorsProfile?.specializations?.length &&
      user?.doctorsProfile?.experience
    ),
    2: !!(
      (user?.doctorsProfile?.consultationFees ||
        user?.doctorsProfile?.clinic?.[0]?.clinicAddress ||
        user?.age ||
        user?.gender) &&
      weeklySchedule?.some((d) => d.isActive && d.slots?.length > 0)
    ),
    3: false,
  });

  const dispatch = useDispatch();
  // const doctorProfile = useSelector((state) => state.auth.user?.doctorsProfile);

  // Step 1 form data
  const [step1Data, setStep1Data] = useState({
    registrationNumber:
      user?.doctorsProfile?.essentials?.registrationNumber || "",
    registrationCouncil:
      user?.doctorsProfile?.essentials?.registrationCouncil || "",
    institute: user?.doctorsProfile?.essentials?.institute || "",
    instituteLocation: user?.doctorsProfile?.essentials?.institute || "",
    completionOfDegree:
      user?.doctorsProfile?.essentials?.completionOfDegree || "",
    qualifications: user?.doctorsProfile?.qualifications?.[0] || "",
    specializations: user?.doctorsProfile?.specializations?.[0] || "",
    experience: user?.doctorsProfile?.experience || "",
  });

  // Step 2 form data with enhanced schedule management
  // Step 2 form data with enhanced schedule management
  const initialWeeklySchedule =
    weeklySchedule && weeklySchedule.length > 0
      ? weeklySchedule.reduce((acc, d) => {
          const key = d.day.toLowerCase(); // e.g. "Monday" -> "monday"
          acc[key] = {
            isActive: d.isActive,
            timeSlots: (d.slots || []).map((s, idx) => ({
              id: s._id || idx,
              startTime: s.startTime,
              endTime: s.endTime,
            })),
            slotDuration: String(d.slotDuration || "30"),
          };
          return acc;
        }, {})
      : {
          monday: { isActive: false, timeSlots: [], slotDuration: "30" },
          tuesday: { isActive: false, timeSlots: [], slotDuration: "30" },
          wednesday: { isActive: false, timeSlots: [], slotDuration: "30" },
          thursday: { isActive: false, timeSlots: [], slotDuration: "30" },
          friday: { isActive: false, timeSlots: [], slotDuration: "30" },
          saturday: { isActive: false, timeSlots: [], slotDuration: "30" },
          sunday: { isActive: false, timeSlots: [], slotDuration: "30" },
        };

  console.log("Initial Weekly Schedule:", initialWeeklySchedule);

  const [step2Data, setStep2Data] = useState({
    consultationFees: user?.doctorsProfile?.consultationFees || "",
    clinicAddress: user?.doctorsProfile?.clinic?.[0]?.clinicAddress || "",
    state: user?.doctorsProfile?.clinic?.[0]?.state || "",
    age: user?.age || "",
    gender: user?.gender || "",
    slotDuration: "30",
    clinicName: user?.doctorsProfile?.clinic?.[0]?.clinicName || "",

    weeklySchedule: initialWeeklySchedule,
  });

  // Step 3 form data
  // Step 3 form data
  const [step3Data, setStep3Data] = useState({
    medicalRegistrationCertificate: null,
    identityProof: null,
    propertyProof: null,
    profilePhoto: null,
  });

  // Generate time slots from 7:00 to 22:00 with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 21) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    slots.push("22:00");
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const durationOptions = ["15", "30", "45", "60"];

  // Handle day activation/deactivation
  const toggleDay = (day) => {
    setStep2Data((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          isActive: !prev.weeklySchedule[day].isActive,
          timeSlots: !prev.weeklySchedule[day].isActive
            ? []
            : prev.weeklySchedule[day].timeSlots,
        },
      },
    }));
  };

  // Add time slot to a specific day
  const addTimeSlot = (day, startTime, endTime) => {
    if (!startTime || !endTime) {
      toast.error("Please select both start and end time");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    const newSlot = { startTime, endTime, id: Date.now() };

    setStep2Data((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          timeSlots: [...prev.weeklySchedule[day].timeSlots, newSlot],
        },
      },
    }));
  };

  // Remove time slot from a specific day
  const removeTimeSlot = (day, slotId) => {
    setStep2Data((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          timeSlots: prev.weeklySchedule[day].timeSlots.filter(
            (slot) => slot.id !== slotId
          ),
        },
      },
    }));
  };

  // Update slot duration for a specific day
  const updateSlotDuration = (day, duration) => {
    setStep2Data((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          slotDuration: duration,
        },
      },
    }));
  };

  const nextStep = () => {
    if (savedSteps[step]) {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setStep((prev) => prev - 1);

  // --------------------- STEP 1 Save & Update ---------------------
  const handleSaveStep1 = async () => {
    try {
      setLoading(true);
      console.log("Saving Step 1 Data:", step1Data);
      const res = await axios.post(
        "/api/doctor/medicalRegistration/create",
        step1Data, // <-- no need for JSON.stringify or wrapping in {body:...}
        { withCredentials: true }
      );

      const data = res.data; // axios gives response in res.data
      if (data.success) {
        // dispatch(updateDoctorProfile(data.user.doctorsProfile));
        dispatch(setUser(data.user));
        toast.success("Step 1 Saved Successfully");
        setSavedSteps((prev) => ({ ...prev, 1: true }));
      } else {
        toast.error(data.message || "Failed to save step 1");
      }
    } catch (error) {
      console.error("Error saving step 1:", error);
      toast.error(error.response?.data?.message || "Failed to save step 1");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStep1 = async () => {
    try {
      console.log("this is step 1 data", step1Data);
      setLoading(true);
      const res = await axios.put(
        "/api/doctor/medicalRegistration/update",

        step1Data,

        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Step 1 Updated Successfully");
      } else {
        toast.error(error.response?.data?.message || "Failed to update step 1");
      }
    } catch (error) {
      console.error("Error updating step 1:", error);
      toast.error(error.response?.data?.message || "Failed to update step 1");
    } finally {
      setLoading(false);
    }
  };

  // --------------------- STEP 2 Save & Update ---------------------
  const handleSaveStep2 = async () => {
    try {
      setLoading(true);
      // Convert weeklySchedule object → array
      const formattedSchedule = Object.entries(step2Data.weeklySchedule).map(
        ([day, details]) => ({
          day: day.charAt(0).toUpperCase() + day.slice(1), // capitalize
          isActive: details.isActive,
          slotDuration: Number(details.slotDuration),
          slots: details.timeSlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false, // default
          })),
        })
      );

      const finalData = {
        ...step2Data,
        weeklySchedule: formattedSchedule,
      };

      console.log("Saving Step 2 Data:", finalData);

      const res = await axios.post(
        "/api/doctor/clinicSetup/create",
        finalData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Step 2 Saved Successfully");
        setSavedSteps((prev) => ({ ...prev, 2: true }));
        dispatch(setWeeklySchedule(res.data.weeklySchedule));
      } else {
        toast.error(error.response.data.message || "Failed to save step 2");
      }
    } catch (err) {
      console.error("Error saving step 2:", err);
      toast.error("Failed to save step 2");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStep2 = async () => {
    try {
      setLoading(true);

      const formattedSchedule = Object.entries(step2Data.weeklySchedule).map(
        ([day, details]) => ({
          day: day.charAt(0).toUpperCase() + day.slice(1), // capitalize
          isActive: details.isActive,
          slotDuration: Number(details.slotDuration),
          slots: details.timeSlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false, // default
          })),
        })
      );

      const finalData = {
        ...step2Data,
        weeklySchedule: formattedSchedule,
      };

      console.log("Saving Step 2 Data:", finalData);

      const res = await axios.put("/api/doctor/clinicSetup/update", finalData, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Step 2 Saved Successfully");
        setSavedSteps((prev) => ({ ...prev, 2: true }));
        dispatch(setWeeklySchedule(res.data.weeklySchedule));
      } else {
        toast.error(data.message || "Failed to update step 2");
      }
    } catch (err) {
      console.error("Error updating step 2:", err);
      toast.error("Failed to update step 2");
    } finally {
      setLoading(false);
    }
  };

  // --------------------- STEP 3 Save & Update ---------------------
  const handleSaveStep3 = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "medicalRegistrationCertificate",
        step3Data.medicalRegistrationCertificate
      );
      formData.append("identityProof", step3Data.identityProof);
      formData.append("propertyProof", step3Data.propertyProof);
      formData.append("profilePhoto", step3Data.profilePhoto);

      const res = await axios.post("/api/doctor/uploadProofs", formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSavedSteps((prev) => ({ ...prev, 3: true }));
        router.push("/doctor/profileSubmitted");
      }
    } catch (err) {
      console.error("Error saving step 3:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStep3 = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "medicalRegistrationCertificate",
        step3Data.medicalRegistrationCertificate
      );
      formData.append("identityProof", step3Data.identityProof);
      formData.append("propertyProof", step3Data.propertyProof);
      formData.append("profilePhoto", step3Data.profilePhoto);

      const res = await fetch("/api/doctor/verification/step3", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // maybe toast or update store
      }
    } catch (err) {
      console.error("Error updating step 3:", err);
    }
  };

  // Component for managing time slots for each day
  const DayScheduleManager = ({ day, dayData }) => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleAddSlot = () => {
      addTimeSlot(day, startTime, endTime);
      setStartTime("");
      setEndTime("");
    };

    return (
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Switch
              className="cursor-pointer"
              checked={dayData.isActive}
              onCheckedChange={() => {
                document.activeElement?.blur(); // blur whatever is focused
                toggleDay(day);
              }}
            />
            <Label className="text-lg font-medium capitalize">{day}</Label>
          </div>
          {dayData.isActive && (
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Duration per slot:</Label>
              <Select
                value={dayData.slotDuration}
                onValueChange={(value) => updateSlotDuration(day, value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {dayData.isActive && (
          <div className="space-y-3">
            {/* Add new time slot */}
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-4 w-4 text-gray-500" />
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-gray-500">to</span>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleAddSlot();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Display existing time slots */}
            {dayData.timeSlots.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Active Time Slots:
                </Label>
                {dayData.timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded-md"
                  >
                    <span className="text-sm">
                      {slot.startTime} - {slot.endTime} ({dayData.slotDuration}{" "}
                      min slots)
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        removeTimeSlot(day, slot.id);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6 pt-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 overflow-auto max-h-[calc(100vh-4rem)]">
        {/* Step indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 text-center py-2 rounded-full mx-1 text-sm font-medium 
              ${
                step === s
                  ? "bg-[#1195FF] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Step {s}
            </div>
          ))}
        </div>

        {/* Step Forms */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Medical Registration Details
              </h2>
              <Input
                placeholder="Medical Registration Number"
                name="registrationNumber"
                value={step1Data.registrationNumber}
                onChange={(e) =>
                  setStep1Data({
                    ...step1Data,
                    registrationNumber: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Registration Council"
                name="registrationCouncil"
                value={step1Data.registrationCouncil}
                onChange={(e) =>
                  setStep1Data({
                    ...step1Data,
                    registrationCouncil: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Educational Institute"
                name="institute"
                value={step1Data.institute}
                onChange={(e) =>
                  setStep1Data({ ...step1Data, institute: e.target.value })
                }
              />

              <Input
                placeholder="State Of Institute"
                name="instituteLocation"
                value={step1Data.instituteLocation}
                onChange={(e) =>
                  setStep1Data({
                    ...step1Data,
                    instituteLocation: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Year of Completion"
                type="number"
                name="completionOfDegree"
                value={step1Data.completionOfDegree}
                onChange={(e) =>
                  setStep1Data({
                    ...step1Data,
                    completionOfDegree: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Qualifications such as MBBS , MD ,DNB"
                name="qualifications"
                value={step1Data.qualifications}
                onChange={(e) =>
                  setStep1Data({ ...step1Data, qualifications: e.target.value })
                }
              />

              <Input
                placeholder="Specializations Such as Dermatologist , Physician etc ...."
                name="specializations"
                value={step1Data.specializations}
                onChange={(e) =>
                  setStep1Data({
                    ...step1Data,
                    specializations: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Experience in Years"
                type="number"
                name="experience"
                value={step1Data.experience}
                onChange={(e) =>
                  setStep1Data({ ...step1Data, experience: e.target.value })
                }
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Clinic Schedule & Details
              </h2>

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Consultation Fees
                  </label>
                  <Input
                    placeholder="e.g. 500"
                    type="number"
                    value={step2Data.consultationFees}
                    onChange={(e) =>
                      setStep2Data({
                        ...step2Data,
                        consultationFees: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <Input
                    placeholder="e.g. 35"
                    type="number"
                    value={step2Data.age}
                    onChange={(e) =>
                      setStep2Data({ ...step2Data, age: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Clinic Address
                  </label>
                  <Input
                    placeholder="e.g. 123 Main Street, Near City Hospital"
                    value={step2Data.clinicAddress}
                    onChange={(e) =>
                      setStep2Data({
                        ...step2Data,
                        clinicAddress: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    State
                  </label>
                  <Input
                    placeholder="e.g. Uttar Pradesh, Maharashtra"
                    value={step2Data.state}
                    onChange={(e) =>
                      setStep2Data({ ...step2Data, state: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex w-full flex-col gap-2">
                  <Label>Gender</Label>
                  <Select
                    onValueChange={(val) =>
                      setStep2Data({ ...step2Data, gender: val })
                    }
                    defaultValue={step2Data.gender}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Clinic Name Or Hospital Name</Label>
                  <Input
                    value={step2Data.clinicName}
                    onChange={(e) =>
                      setStep2Data({ ...step2Data, clinicName: e.target.value })
                    }
                  />
                </div>
              </div>

            

              {/* Weekly Schedule Management */}
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Weekly Schedule Management
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Set your operating hours for each day. You can add multiple
                    time slots per day and set duration for each slot.
                  </p>

                  <div className="space-y-4">
                    {Object.entries(step2Data.weeklySchedule).map(
                      ([day, dayData]) => (
                        <DayScheduleManager
                          key={day}
                          day={day}
                          dayData={dayData}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload Proof Documents
              </h2>

              {/* Profile Photo */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1195FF] transition">
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setStep3Data({
                      ...step3Data,
                      profilePhoto: e.target.files?.[0],
                    })
                  }
                />
                <label htmlFor="profilePhoto" className="cursor-pointer">
                  <div className="text-gray-600">Upload Profile Photo</div>
                  {step3Data.profilePhoto && (
                    <div className="text-sm text-green-600 mt-2">
                      ✅ {step3Data.profilePhoto.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Medical Certificate */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1195FF] transition">
                <input
                  type="file"
                  id="medicalRegistrationCertificate"
                  className="hidden"
                  onChange={(e) =>
                    setStep3Data({
                      ...step3Data,
                      medicalRegistrationCertificate: e.target.files[0],
                    })
                  }
                />
                <label
                  htmlFor="medicalRegistrationCertificate"
                  className="cursor-pointer"
                >
                  <div className="text-gray-600">
                    Upload Medical Certificate
                  </div>
                  {step3Data.medicalRegistrationCertificate && (
                    <div className="text-sm text-green-600 mt-2">
                      ✅ {step3Data.medicalRegistrationCertificate.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Government ID */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1195FF] transition">
                <input
                  type="file"
                  id="identityProof"
                  className="hidden"
                  onChange={(e) =>
                    setStep3Data({
                      ...step3Data,
                      identityProof: e.target.files[0],
                    })
                  }
                />
                <label htmlFor="identityProof" className="cursor-pointer">
                  <div className="text-gray-600">Upload Government ID</div>
                  {step3Data.identityProof && (
                    <div className="text-sm text-green-600 mt-2">
                      ✅ {step3Data.identityProof.name}
                    </div>
                  )}
                </label>
              </div>

              {/* Property Proof */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1195FF] transition">
                <input
                  type="file"
                  id="propertyProof"
                  className="hidden"
                  onChange={(e) =>
                    setStep3Data({
                      ...step3Data,
                      propertyProof: e.target.files[0],
                    })
                  }
                />
                <label htmlFor="propertyProof" className="cursor-pointer">
                  <div className="text-gray-600">Upload Property Proof</div>
                  {step3Data.propertyProof && (
                    <div className="text-sm text-green-600 mt-2">
                      ✅ {step3Data.propertyProof.name}
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            {/* Save / Update */}
            {step === 1 &&
              (savedSteps[1] ? (
                loading ? (
                  <Button variant="outline" className="bg-green-600 text-white">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Updating...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleUpdateStep1}
                    className="bg-green-600 text-white"
                  >
                    Update
                  </Button>
                )
              ) : loading ? (
                <Button variant="outline" className="bg-green-500 text-white">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleSaveStep1}
                  className="bg-green-500 text-white"
                >
                  Save
                </Button>
              ))}
            {step === 2 &&
              (savedSteps[2] ? (
                loading ? (
                  <Button variant="outline" className="bg-green-600 text-white">
                    <Loader2 />
                    Updating ...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleUpdateStep2}
                    className="bg-green-600 text-white"
                  >
                    Update
                  </Button>
                )
              ) : loading ? (
                <Button variant="outline" className="bg-green-500 text-white">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleSaveStep2}
                  className="bg-green-500 text-white"
                >
                  Save
                </Button>
              ))}

            {/* Next / Submit */}
            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!savedSteps[step]}
                className={`${
                  savedSteps[step]
                    ? "bg-[#1195FF] hover:bg-[#0d7dd1] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </Button>
            ) : loading ? (
              <Button className="bg-[#1195FF] hover:bg-[#0d7dd1] text-white">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Uploading...
              </Button>
            ) : (
              <Button
                onClick={handleSaveStep3}
                disabled={
                  !step3Data.profilePhoto ||
                  !step3Data.medicalRegistrationCertificate ||
                  !step3Data.identityProof ||
                  !step3Data.propertyProof
                }
                className="bg-[#1195FF] hover:bg-[#0d7dd1] text-white"
              >
                Submit Verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
