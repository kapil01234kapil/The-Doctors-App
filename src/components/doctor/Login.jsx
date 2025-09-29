// app/(auth)/login/doctor/page.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setUser } from "@/redux/authSlice";

export default function DoctorLogin() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { user } = useSelector((store) => store.auth);
  console.log("This is user", user);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Doctor Login Data:", form);
    try {
      setLoading(true);
      const res = await axios.post("/api/doctor/login", form, {
        withCredentials: true,
      });
      if (res.data.success) {
        console.log("Login Success:", res.data);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);

        const doctorProfile = res.data.user.doctorsProfile; // ✅ use response directly
        console.log("Status Of Profile Submitted", doctorProfile);

        if (doctorProfile?.verifiedDoctor === true) {
          router.push("/doctor/dashboard");

        } else {
          if (doctorProfile?.profileSubmitted === true) {
            router.push("/doctor/profileSubmitted");

          } else {
            router.push("/doctor/verification");
          }
        }
      }
    } catch (error) {
      console.log("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
    // later: dispatch(loginDoctor(form));
  };

  return (
    <div className="flex min-h-screen items-center justify-center  px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        {/* Top Toggle Buttons */}
        <div className="flex w-full">
          <Link href="/login/doctor" className="w-1/2">
            <Button className="w-full rounded-none rounded-tl-2xl bg-[#4d91ff] text-white hover:bg-blue-600">
              Login
            </Button>
          </Link>
          <Link href="/register/doctor" className="w-1/2">
            <Button
              variant="outline"
              className="w-full rounded-none rounded-tr-2xl border-gray-200 text-gray-700 hover:text-[#4d91ff]"
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Doctor Login Form */}
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-[#4d91ff]">
            Doctor Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* Password with Eye Toggle */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4d91ff]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#4d91ff] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            {loading ? (
              <Button
                className="w-full bg-[#4d91ff] hover:bg-blue-600"
                disabled
              >
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-[#4d91ff] hover:bg-blue-600"
              >
                Login
              </Button>
            )}
          </form>

          {/* Patient Login Section */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Are you a Patient?{" "}
              <Link
                href="/login/patient"
                className="font-semibold text-[#4d91ff] hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
