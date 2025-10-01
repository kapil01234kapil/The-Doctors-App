import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <footer className="bg-[#4d91ff] text-white w-full ">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between md:items-start text-center md:text-left gap-10">
        {/* Brand Section */}
        <div className="flex-1 flex flex-col gap-5 items-center md:items-start">
          <h1 className="font-bold text-2xl">DOCTORS.ONLINE</h1>
          <p className="text-sm text-white/90 leading-relaxed max-w-sm">
            In 2024, 19-year-old Kapil, frustrated by long hospital waits, set
            out to build an online doctor appointment platform. Partnering with
            developer Smarth, they overcame challenges to launch Doctor.online,
            making healthcare access faster and easier. By 2025, it became a
            trusted tool for patients and doctors nationwide.
          </p>
        </div>

        {/* For Patients */}
        <div className="flex-1 flex flex-col gap-3 items-center md:items-start">
          <h2 className="font-semibold text-lg mb-2">For Patients</h2>
          <Link href="/allDoctors">Find A Doctor</Link>
          <Link href="">Book Appointment</Link>
          {user === null ? (
            <Link href="/login/patient">My Appointments</Link>
          ) : (
            <Link href="/patient/myAppointments">My Appointments</Link>
          )}
          <Link href="/login/patient">Patient Login</Link>
        </div>

        {/* For Doctors */}
        <div className="flex-1 flex flex-col gap-3 items-center md:items-start">
          <h2 className="font-semibold text-lg mb-2">For Doctors</h2>
          <Link href="/about">About Us</Link>
          {user === null ? (
            <Link href="/login/doctor">Admin Support</Link>
          ) : (
            <Link href="/doctor/feedback">Admin Support</Link>
          )}
          <Link href="/contact">Contact Support</Link>
          {user === null ? (
            <Link href="/login/doctor">Feedback</Link>
          ) : (
            <Link href="/doctor/feedback">Feedback</Link>
          )}
        </div>
      </div>

      {/* Divider Line */}
      <hr className="border-t border-white/30" />

      {/* Bottom Section */}
      <div className="flex flex-col py-4">
        <div className="text-center text-sm">
          © {new Date().getFullYear()} Doctors.Online — All Rights Reserved
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/terms-conditions" className="text-sm">
            Terms & Conditions
          </Link>
          <Link href="/privacy-policy" className="text-sm">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
