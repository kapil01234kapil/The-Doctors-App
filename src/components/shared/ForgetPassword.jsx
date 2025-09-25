"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/authSlice";

const ForgetPasswordPage = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('/api/forgetPassword',{email},{withCredentials:true})
        if(res.data.success){
            toast.success(res.data.message)
            dispatch(setUser(res.data.user))
            router.push('/verify-password-reset')
        } else{
            toast.error(res.data.message )
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something Went Wrong" )
        
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/forget-password", { email });
      toast.success(res.data.message || "Reset link sent to your email");
      dispatch(setUser(res.data.user))
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo / App Name */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#4D91FF] mb-6">
          Doctors.Online
        </h1>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Forgot your password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email and we’ll send you a reset link.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:ring-[#4D91FF]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4D91FF] hover:bg-[#3c7ce6] text-white font-medium py-2 rounded-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Back to login */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Remembered your password?{" "}
          <a href="/patient/login" className="text-[#4D91FF] font-medium hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
