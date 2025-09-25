"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const GetInTouch = () => {
  const {user} = useSelector((store) => store.auth)
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    message: "",
  });

  const [messageLength, setMessageLength] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "message") {
      setMessageLength(value.length);
    }
  };
const handleSubmit = async () => {
  console.log("Form submitted:", formData);
  try {
    setLoading(true);
    const res = await axios.post(
      "/api/adminSupport",
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: `${formData.countryCode} ${formData.phone}`,
        supportMessage: formData.message,
      },
      { withCredentials: true }
    );
    if (res.data.success) {
      toast.success(res.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "+91",
        message: "",
      });
      if (user?.role === "patient") {
        router.push("/");
      } else {
        router.push("/doctor/dashboard");
      }
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const countryCodes = [
    { code: "+44", country: "UK" },
    { code: "+1", country: "US" },
    { code: "+91", country: "IN" },
    { code: "+49", country: "DE" },
    { code: "+33", country: "FR" },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Dotted Map Illustration */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative w-full max-w-md lg:max-w-xl">
              {/* Using the map image from public folder */}
              <img
                src="/map.png"
                alt="Dotted world map illustration"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              {/* Fallback dotted pattern if image fails to load */}
              <div className="hidden w-full h-96 relative">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full"
                  fill="none"
                >
                  {/* Create a dotted world map pattern */}
                  {Array.from({ length: 40 }, (_, i) =>
                    Array.from({ length: 30 }, (_, j) => (
                      <circle
                        key={`${i}-${j}`}
                        cx={i * 10 + 10}
                        cy={j * 10 + 10}
                        r={Math.random() > 0.7 ? 2 : 0}
                        fill="#374151"
                        opacity={0.6}
                      />
                    ))
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="w-full order-1 lg:order-2">
            <div className="max-w-md mx-auto lg:max-w-lg lg:mx-0">
              {/* Header */}
              <div className="text-center lg:text-left mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Let's Get In Touch.
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Or just reach out manually to{" "}
                  <a
                    href="mailto:hello@doctors.online"
                    className="text-blue-600 hover:underline"
                  >
                    hello@doctors.online
                  </a>
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name..."
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name..."
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address..."
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative">
                      <select
                        value={formData.countryCode}
                        onChange={(e) =>
                          handleInputChange("countryCode", e.target.value)
                        }
                        className="appearance-none h-12 px-3 pr-8 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                      >
                        {countryCodes.map(({ code, country }) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Phone Input */}
                    <div className="relative flex-1">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(000) 000-0000"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Message
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      placeholder="Enter your main text here..."
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      className="min-h-32 resize-none border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      maxLength={300}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {messageLength}/300
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {loading ? (
                  <Button
                    disabled
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200"
                    variant="outline"
                  ><Loader2 className="animate-spin mr-2 h-4 w-4"/>Submitting</Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSubmit}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200"
                    size="lg"
                  >
                    Submit Form
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
