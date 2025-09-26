"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardPlus, IndianRupee, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const BookingConfirmed = () => {
  const [loading, setLoading] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const { id } = useParams();
  const { selectedDoctor } = useSelector((store) => store.auth);
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  const router = useRouter();

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      const consultationFees = Number(
        selectedDoctor?.doctorsProfile?.consultationFees || 0
      );
      const appointmentFee = 99;
      const totalAmount = appointmentFee;

      const body = {
        ...formData,
        amount: totalAmount,
        clinicAddress:
          selectedDoctor?.doctorsProfile?.clinic?.[0]?.clinicAddress,
      };

      const res = await axios.post(`/api/patient/createOrder/${id}`, body, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Order created successfully");
        setRazorpayOrderId(res.data.order.id);

        const isRazorpayLoaded = await loadRazorpayScript();
        if (!isRazorpayLoaded) {
          toast.error("Failed to load Razorpay SDK. Are you online?");
          return;
        }

        const options = {
          key: "rzp_test_RESUioZgG90aU9",
          amount: res.data.order.amount,
          currency: "INR",
          name: "Your App Name",
          order_id: res.data.order.id,
          handler: async function (response) {
            const { razorpay_payment_id } = response;

            const verifyRes = await axios.post(
              `/api/patient/verifyPayment/${id}`,
              {
                razorpay_order_id: res.data.order.id,
                razorpay_payment_id,
                appointmentId: id,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
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
      } else {
        toast.error(res.data.message);
      }
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
        {/* Doctor Image */}
        <div className="w-full lg:w-1/3 flex justify-center items-center">
          <Image
            height={600}
            width={400}
            alt="Doctor's photo"
            className="rounded-3xl object-cover w-full h-auto max-w-sm"
            src={selectedDoctor?.profilePhoto}
          />
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col w-full lg:w-2/3 gap-6">
          <h1 className="font-bold text-2xl">{selectedDoctor?.fullName}</h1>
          <p className="text-lg text-gray-700">
            {selectedDoctor?.doctorsProfile?.qualifications?.join(", ")}
          </p>
          <p className="pb-3 border-b-2 border-dashed border-gray-400">
            Speciality in{" "}
            <span className="font-medium">
              {selectedDoctor?.doctorsProfile?.specializations}
            </span>
          </p>
          <p className="text-gray-600 text-lg">Working At</p>
          <h1 className="text-lg font-medium">
            {selectedDoctor?.doctorsProfile?.clinic?.[0]?.clinicAddress ||
              "TMMS Medical College & Rafatullah Community Hospital"}
            , {selectedDoctor?.doctorsProfile?.clinic?.[0]?.city}
          </h1>
          <h1 className="font-bold text-xl">
            Consultation Fees: ₹
            {selectedDoctor?.doctorsProfile?.consultationFees}
          </h1>
        </div>
      </div>

      {/* Booking + Payment Section */}
      <div className="flex flex-col md:flex-row justify-center gap-7 p-4 mt-8">
        {/* Form Section */}
        <div className="flex flex-col w-full md:w-1/2 bg-white p-4 rounded-lg gap-4">
          <h1 className="font-bold">Payment Details</h1>
          <p>Fill in your information to complete the appointment</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1 gap-2">
              <Label>Full Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl bg-white"
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1 gap-2">
              <Label>Age</Label>
              <Input
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="rounded-xl bg-white"
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <Label>Gender</Label>
              <Input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm">Payment Methods</p>
            <div className="flex gap-1 p-2 border justify-center items-center w-fit border-black rounded-xl">
              <ClipboardPlus className="h-4 w-4" />
              <p className="text-xs">Pay To Doctor</p>
            </div>
          </div>
          <h1 className="text-sm">Payment Information</h1>
          <p className="text-xs">
            ₹99 will be charged now to lock your appointment. The remaining
            consultation fee (₹
            {selectedDoctor?.doctorsProfile?.consultationFees - 99}) will be
            paid directly to the doctor during consultation.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-[#f8fbfe] w-full md:w-1/2 rounded-lg p-5 flex flex-col gap-5">
          <h1 className="font-bold">Appointment Details</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Image
              height={140}
              width={100}
              alt="Doctor's photo"
              className="rounded-3xl object-cover h-28 w-24"
              src={selectedDoctor?.profilePhoto}
            />
            <div className="flex flex-col justify-center">
              <p className="text-slate-500 text-xs">27 June</p>
              <p className="font-bold text-md">{selectedDoctor?.fullName}</p>
              <p className="text-sm flex font-bold">
                <IndianRupee className="h-4 w-4" />
                <span>{selectedDoctor?.doctorsProfile?.consultationFees}</span>
              </p>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <p className="text-slate-400">Subtotal</p>
            <p className="font-bold flex">
              <IndianRupee className="h-4 w-4" />
              <span>{selectedDoctor?.doctorsProfile?.consultationFees}</span>
            </p>
          </div>

          <div className="flex justify-between text-sm">
            <p className="text-slate-400">Appointment Fee (Advance Payment)</p>
            <p className="font-bold flex">
              <IndianRupee className="h-4 w-4" />
              <span>99</span>
            </p>
          </div>

          <div className="flex justify-between text-sm">
            <p className="text-slate-400">
              Remaining Consultation Fee (Pay to Doctor)
            </p>
            <p className="font-bold flex">
              <IndianRupee className="h-4 w-4" />
              <span>
                {selectedDoctor?.doctorsProfile?.consultationFees - 99}
              </span>
            </p>
          </div>

          <div className="flex px-3 items-center w-full gap-2">
            <Input
              type="checkbox"
              checked={isTermsChecked}
              onChange={(e) => setIsTermsChecked(e.target.checked)}
              className="w-5"
            />
            <p className="text-sm">
              I agree to the{" "}
              <span className="underline text-blue-600">
                terms and conditions
              </span>
            </p>
          </div>

          {loading ? (
            <Button className="bg-[#4d7ded] h-10 text-lg text-white disabled">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Please Await...
            </Button>
          ) : (
            <Button
              onClick={handleBooking}
              disabled={!isTermsChecked || loading}
              variant="outline"
              className={`bg-[#4d7ded] h-10 text-lg text-white ${
                !isTermsChecked || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Place Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
