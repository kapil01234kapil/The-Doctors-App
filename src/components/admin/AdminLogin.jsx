"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const res = await axios.post("/api/admin/login",{email,password},{withCredentials:true});
      if(res.data.success){
        dispatch(setUser({role : "admin"}));
        toast.success(res.data.message)
        router.push("/admin/dashboard")
      } else{
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || "Something Went Wrong")
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#4d91ff] text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
              />
              <User
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
              />
              <Lock
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg ${
              loading
                ? "bg-[#4d91ff]/60 cursor-not-allowed"
                : "bg-[#4d91ff] hover:bg-[#3572c4]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Doctors-Online. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
