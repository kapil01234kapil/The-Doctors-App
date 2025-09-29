"use client";
import React, { useState } from "react";
import {
  HelpCircle,
  LifeBuoy,
  CreditCard,
  ShieldCheck,
  Users,
  Smartphone,
  BookOpen,
  Settings,
} from "lucide-react";

const Faq = () => {
  const faqs = [
    {
      question: "Is there a free trial?",
      answer:
        "Yes, we offer a 14-day free trial with full access to all premium features. No credit card required.",
      icon: HelpCircle,
    },
    {
      question: "How does support work?",
      answer:
        "Our support team is available 24/7 via live chat, email, and phone to assist you with any issue.",
      icon: LifeBuoy,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, PayPal, and popular digital wallets for seamless and secure payments.",
      icon: CreditCard,
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use enterprise-grade encryption and follow strict compliance standards to keep your data safe.",
      icon: ShieldCheck,
    },
    {
      question: "Can I add my team members?",
      answer:
        "Yes, you can invite unlimited team members and manage their roles and permissions easily.",
      icon: Users,
    },
    {
      question: "Do you have a mobile app?",
      answer:
        "Yes, our mobile app is available for iOS and Android, giving you access on the go.",
      icon: Smartphone,
    },
    {
      question: "Where can I find tutorials?",
      answer:
        "We provide a complete knowledge base, video tutorials, and guided product tours to help you get started.",
      icon: BookOpen,
    },
    {
      question: "Can I customize the platform?",
      answer:
        "Yes, you can customize settings, branding, and integrations to match your business needs.",
      icon: Settings,
    },
  ];

  const [showAll, setShowAll] = useState(false);

  return (
    <div className="w-full mt-10 flex p-4 flex-col bg-white justify-center items-center gap-6 px-4 sm:px-6 lg:px-10">
      {/* Title stays center */}
      <h1 className="p-4 text-2xl font-bold text-center">
        Frequently Asked Questions
      </h1>

      {/* Grid always left-aligned */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-5xl">
        {(showAll ? faqs : faqs.slice(0, 4)).map((faq, idx) => (
          <div
            key={idx}
            className="flex gap-3 p-4  hover:shadow-md transition"
          >
            <faq.icon className="text-blue-500 w-6 h-6 shrink-0 mt-1" />
            <div className="flex flex-col text-left">
              <h2 className="font-semibold">{faq.question}</h2>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-4 cursor-pointer px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {showAll ? "View Less" : "View More"}
      </button>
    </div>
  );
};

export default Faq;
