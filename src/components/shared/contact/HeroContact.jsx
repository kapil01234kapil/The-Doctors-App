"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Mail, MessageCircle, Phone, Smile } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const HeroContact = () => {
  const router = useRouter();
  const {user} = useSelector((store) =>store.auth)
  return (
    <div className="w-full p-5">
      <div className="flex flex-col items-center pt-10 justify-center text-center gap-3">
        <h1 className="text-[#1195FF] text-lg font-bold">Contact Us</h1>
        <h1 className="font-bold text-5xl">Get In Touch With Our Team</h1>
        <p>We have team and know-how to help you scale 10x faster</p>

        {/* Main content section */}
        <div className="w-full flex flex-col lg:flex-row justify-center  gap-10">
          {/* Map Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/map.png"
              width={600}
              height={400}
              alt="contact-hero"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>

          {/* Right Content Section */}
          <div className="flex flex-col pt-10 lg:pt-20 gap-15 w-full lg:w-1/2 text-left">
            <div className="flex flex-col justify-center  gap-2">
              <h1 className="font-bold text-xl">Get In Touch Our Team</h1>
              <p className="text-xl">
                We have team and know-how to help you scale 10x faster. Our
                experts provide guidance tailored to your growth.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-xl">Customer Support</h1>
              <p className="text-xl">
                Need help? Our dedicated support team is available to answer
                your queries and resolve issues quickly.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-bold  text-xl">Partnerships</h1>
              <p className="text-xl">
                Looking to collaborate? Reach out to our partnerships team to
                explore opportunities and grow together.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-5 gap-5 flex-wrap">
          {/* 1. Give Feedback */}
        {/* 1. Feedback Card */}
<Card className="w-64">
  <CardHeader>
    <div className="bg-white w-fit p-2 rounded-full shadow">
      <Smile className="text-blue-600" />
    </div>
  </CardHeader>
  <CardContent>
    <h1 className="font-bold">Give Feedback To Us</h1>
    <p>We value your thoughts and opinions</p>
  </CardContent>
  <CardFooter className="flex justify-center">
    <Button
      variant="outline"
      className="bg-blue-700 text-white w-full"
      onClick={() =>
        user ? router.push("/patient/feedback") : router.push("/login/patient")
      }
    >
      Give Feedback
    </Button>
  </CardFooter>
</Card>

{/* 2. Chat to Support */}
<Card className="w-64">
  <CardHeader>
    <div className="bg-white w-fit p-2 rounded-full shadow">
      <MessageCircle className="text-blue-600" />
    </div>
  </CardHeader>
  <CardContent>
    <h1 className="font-bold">Chat To Support</h1>
    <p>Speak directly with our support team</p>
  </CardContent>
  <CardFooter className="flex justify-center">
    <Button
      variant="outline"
      className="bg-blue-700 text-white w-full"
      onClick={() =>
        user ? router.push("/patient/contact-admin") : router.push("/login/patient")
      }
    >
      Start Chat
    </Button>
  </CardFooter>
</Card>

          {/* 3. Contact us on Email */}
          <Card className="w-64">
            <CardHeader>
              <div className="bg-white w-fit p-2 rounded-full shadow">
                <Mail className="text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <h1 className="font-bold">Contact Us via Email</h1>
              <p>Send us your queries anytime</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=privacydoctoronline336@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                {" "}
                <Button
                  variant="outline"
                  className="bg-blue-700 p-2  text-xs text-white w-full"
                >
                  privacydoctoronline336@gmail.com
                </Button>
              </a>
            </CardFooter>
          </Card>

          {/* 4. Contact us on WhatsApp */}
          <Card className="w-64">
            <CardHeader>
              <div className="bg-white w-fit p-2 rounded-full shadow">
                <Phone className="text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <h1 className="font-bold">Contact Us on WhatsApp</h1>
              <p>Quick help on your WhatsApp</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="https://wa.me/9027226881" target="_blank">
                <Button
                  variant="outline"
                  className="bg-green-600 text-white w-full"
                >
                  Chat on WhatsApp
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroContact;
