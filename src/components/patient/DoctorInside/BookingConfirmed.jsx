"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardPlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setExistingAppointment } from "@/redux/authSlice";
import { ENABLE_PAYMENTS } from "@/lib/config";

const BookingConfirmed = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams(); // appointmentId

  const { selectedDoctor } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- Razorpay Loader (KEPT) ---------------- */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ---------------- Main Handler ---------------- */
  const handleBooking = async () => {
    try {
      setLoading(true);

      // basic validation
      if (
        !formData.name ||
        !formData.phoneNumber ||
        !formData.age ||
        !formData.gender
      ) {
        toast.error("Please fill all patient details");
        return;
      }

      /* ==========================
         🟢 FREE FLOW (NO PAYMENT)
      ========================== */
      if (!ENABLE_PAYMENTS) {
        const res = await axios.post(
          "/api/patient/confirmFreeAppointment",
          {
            appointmentId: id,
            patientProfile: formData,
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setExistingAppointment(null));
          toast.success("Appointment confirmed successfully");
          router.push("/patient/myAppointments");
        } else {
          toast.error(res.data.message || "Failed to confirm appointment");
        }

        return;
      }

      /* ==========================
         🔵 RAZORPAY FLOW (UNCHANGED)
      ========================== */
      const appointmentFee = 100;

      const body = {
        ...formData,
        amount: appointmentFee,
        clinicAddress:
          selectedDoctor?.doctorsProfile?.clinic?.[0]?.clinicAddress,
      };

      const res = await axios.post(`/api/patient/createOrder/${id}`, body, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Order created successfully");

      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        toast.error("Failed to load Razorpay SDK");
        return;
      }

      const options = {
        key: "rzp_test_RESUioZgG90aU9",
        amount: res.data.order.amount,
        currency: "INR",
        name: "The Doctors App",
        order_id: res.data.order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            `/api/patient/verifyPayment/${id}`,
            {
              razorpay_order_id: res.data.order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              appointmentId: id,
            },
            { withCredentials: true }
          );

          if (verifyRes.data.success) {
            dispatch(setExistingAppointment(null));
            toast.success("Payment verified successfully");
            router.push("/patient/myAppointments");
          } else {
            toast.error(verifyRes.data.message);
          }
        },
        theme: { color: "#4d7ded" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12">
      {/* Top Section */}
      <div className="w-full flex flex-col lg:flex-row justify-center mt-10 gap-8">
        <div className="w-full lg:w-1/3 flex justify-center">
          <Image
            height={400}
            width={300}
            alt="Doctor's photo"
            className="rounded-3xl object-contain w-full max-h-[400px]"
            src={selectedDoctor?.profilePhoto}
          />
        </div>

        <div className="flex flex-col w-full lg:w-2/3 gap-6">
          <h1 className="font-bold text-4xl">
            Dr. {selectedDoctor?.fullName}
          </h1>
          <p className="text-lg text-gray-700">
            {selectedDoctor?.doctorsProfile?.qualifications?.join(", ")}
          </p>
          <p className="border-b-2 pb-6 border-dashed border-gray-400">
            Speciality in{" "}
            <span className="font-medium">
              {selectedDoctor?.doctorsProfile?.specializations}
            </span>
          </p>
          <h1 className="font-bold text-2xl">
            Consultation Fees:{" "}
            <span className="text-[#4d91ff] ml-3">
              ₹{selectedDoctor?.doctorsProfile?.consultationFees}
            </span>
          </h1>
        </div>
      </div>

      {/* Booking Section */}
      <div className="flex flex-col md:flex-row justify-center gap-7 p-4 mt-8">
        {/* Form */}
        <div className="flex flex-col w-full md:w-1/2 bg-white p-4 rounded-lg gap-4">
          <h1 className="font-bold">
            {ENABLE_PAYMENTS ? "Payment Details" : "Patient Details"}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              placeholder="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
            <Input
              placeholder="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </div>

          <p className="text-xs">
            {ENABLE_PAYMENTS
              ? "₹99 will be charged now to lock your appointment."
              : "This appointment is currently FREE."}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-[#f8fbfe] w-full md:w-1/2 rounded-lg p-5 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={isTermsChecked}
              onChange={(e) => setIsTermsChecked(e.target.checked)}
              className="w-5"
            />
            <p className="text-sm">I agree to the terms and conditions</p>
          </div>

          <Button
            onClick={handleBooking}
            disabled={!isTermsChecked || loading}
            className="bg-[#4d91ff] cursor-pointer h-10 text-lg text-white"
          >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {ENABLE_PAYMENTS ? "Confirm Booking" : "Confirm Free Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
