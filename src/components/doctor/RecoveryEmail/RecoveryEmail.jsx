"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"

const RecoveryEmail = () => {
  const {user} = useSelector((store) => store.auth);
  const router = useRouter()
  const [formData, setFormData] = useState({
    oldEmail: "",
    newEmail: "",
  })

  // change handler
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/api/addRecoveryEmail", formData,{withCredentials:true})
      if(res.data.success){
        if(user?.role === "patient"){
          router.push("/");
        } else {
          router.push("/doctor/dashboard")
        }
        
        toast.success(res.data.message);
        // router.push("/verify-email-recovery")
      }
      // You can show a success toast or redirect here
    } catch (err) {
      console.error("Error:", err)
      // You can show an error toast here
    }
  }

  return (
    <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10 p-6">
      {/* Left Section */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-6 lg:gap-8 lg:pr-12 lg:border-r lg:border-slate-400 w-full lg:w-1/2"
      >
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-center">
          ADD RECOVERY EMAIL
        </h1>

        <p className="text-xs sm:text-xs text-center text-slate-500 max-w-xs sm:max-w-sm">
          Join Now To Streamline Your Experience From Day One
        </p>

        <div className="flex flex-col gap-2 w-full max-w-xs sm:max-w-sm">
          <Label>Old Email</Label>
          <Input
            name="oldEmail"
            value={formData.oldEmail}
            onChange={handleChange}
            type="email"
            className="h-12"
            placeholder="ENTER YOUR OLD EMAIL"
            required
          />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-xs sm:max-w-sm">
          <Label>New Email</Label>
          <Input
            name="newEmail"
            value={formData.newEmail}
            onChange={handleChange}
            type="email"
            className="h-12"
            placeholder="ENTER YOUR NEW EMAIL"
            required
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className="bg-[#4d91ff] h-12 text-white w-full max-w-xs sm:max-w-sm"
        >
          NEXT
        </Button>
      </form>

      {/* Right Section (Image) */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Image
          height={400}
          width={400}
          src="/recoveryEmailPhoto.png"
          alt="photo not loaded"
          className="w-64 sm:w-80 md:w-96 lg:w-[500px] h-auto"
        />
      </div>
    </div>
  )
}

export default RecoveryEmail
