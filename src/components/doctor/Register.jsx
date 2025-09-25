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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DoctorRegister() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    contactDetails: "",
    email: "",
    password: "",
    city: "",
    couponCode: "", // 👈 added referralCode
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [otherCity, setOtherCity] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = (value) => {
    if (value === "other") {
      setIsOtherCity(true);
      setForm({ ...form, city: "" });
    } else {
      setIsOtherCity(false);
      setForm({ ...form, city: value });
      setOtherCity("");
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Final city value
      const cityToSend = isOtherCity ? otherCity : form.city;
      const payload = { ...form, city: cityToSend };

      console.log("Doctor Register Data:", payload);

      const res = await axios.post("/api/doctor/register", payload);
      if (res.data.success) {
        toast.success(res.data.message);
        setForm({
          fullName: "",
          contactDetails: "",
          email: "",
          password: "",
          city: "",
          couponCode: "", // 👈 reset referralCode also
        });
        setOtherCity("");
        setIsOtherCity(false);
        dispatch(setUser(res.data.user));
        router.push("/verify-email");
      } else {
        toast.error(res.data.message || "Something went wrong");
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
          <Link href="/register/doctor" className="w-1/2">
            <Button className="w-full rounded-none rounded-tl-2xl bg-[#1195FF] text-white hover:bg-blue-600">
              Register
            </Button>
          </Link>
          <Link href="/login/doctor" className="w-1/2">
            <Button
              variant="outline"
              className="w-full rounded-none rounded-tr-2xl border-gray-200 text-gray-700 hover:text-[#1195FF]"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* Doctor Register Form */}
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-[#1195FF]">
            Doctor Registration
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

            {/* Select City */}
            <Select
              onValueChange={handleCityChange}
              value={isOtherCity ? "other" : form.city}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="kolkata">Kolkata</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="jaipur">Jaipur</SelectItem>
                <SelectItem value="lucknow">Lucknow</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Manual City Input - visible only when "Other" is chosen */}
            {isOtherCity && (
              <Input
                type="text"
                placeholder="Enter Your City"
                value={otherCity}
                onChange={(e) => setOtherCity(e.target.value)}
                required={isOtherCity}
              />
            )}

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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1195FF]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Optional Referral Code */}
            <Input
              type="text"
              name="couponCode"
              placeholder="Referral Code (Optional)"
              value={form.couponCode}
              onChange={handleChange}
            />

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
                className="w-full bg-[#1195FF] hover:bg-blue-600"
              >
                Register
              </Button>
            )}
          </form>

          {/* Patient Register Section */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Are you a Patient?{" "}
              <Link
                href="/register/patient"
                className="font-semibold text-[#1195FF] hover:underline"
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
