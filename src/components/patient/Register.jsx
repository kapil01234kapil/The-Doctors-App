"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

export default function PatientRegister() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    contactDetails: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      console.log("Patient Register Data:", form);
      const res = await axios.post("/api/patient/register", form);
      if (res.data.success) {
        toast.success(res.data.message);
        setForm({
          fullName: "",
          contactDetails: "",
          email: "",
          password: "",
        });
        dispatch(setUser(res.data.user));
        router.push("/verify-email");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        {/* Top Toggle Buttons */}
        <div className="flex w-full">
          <Link href="/register/patient" className="w-1/2">
            <Button className="w-full rounded-none rounded-tl-2xl bg-[#4d91ff] text-white hover:bg-blue-600">
              Register
            </Button>
          </Link>
          <Link href="/login/patient" className="w-1/2">
            <Button
              variant="outline"
              className="w-full rounded-none rounded-tr-2xl border-gray-200 text-gray-700 hover:text-[#1195FF]"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* Patient Register Form */}
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-[#4d91ff]">
            Patient Registration
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="contactDetails"
              placeholder="Phone Number"
              value={form.contactDetails}
              onChange={handleChange}
              required
            />
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

            {/* Optional Referral Code */}
        

            {loading ? (
              <Button
                type="button"
                className="w-full bg-gray-400 cursor-not-allowed"
                disabled
              >
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Registering...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-[#4d91ff] hover:bg-blue-600"
              >
                Register
              </Button>
            )}
          </form>

          {/* Doctor Register Section */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Are you a Doctor?{" "}
              <Link
                href="/register/doctor"
                className="font-semibold text-[#4d91ff] hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
