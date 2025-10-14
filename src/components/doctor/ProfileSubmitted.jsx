"use client";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function ProfileSubmitted() {
  const [loading, setLoading] =useState(false);
  const dispatch = useDispatch()
  const router = useRouter();
  const handleLogout = async() => {
    try {
      setLoading(true);
      const res  = await axios.post('/api/logout',{},{withCredentials:true});
      if(res.data.success){
      toast.success(res.data.message);
      dispatch(setUser(null))
      router.push('/');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      
    } finally{
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full text-center"
      >
        <CheckCircle className="mx-auto text-[#1195FF] w-16 h-16 mb-6" />

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Congratulations! 🎉
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Your details have been submitted successfully.  
          Our team will carefully review your profile and verify your credentials.  
          You’ll be notified once your verification is complete.
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-[#1195FF] cursor-pointer text-white font-medium py-3 rounded-xl shadow hover:bg-blue-600 transition"
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
}
