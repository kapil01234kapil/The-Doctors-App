"use client";

import React from "react";

const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4d91ff] mb-6">
          Terms & Conditions – Doctors.Online
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Welcome to Doctors.Online. By using our website/app for booking doctor appointments, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
        </p>

        {/* Sections */}
        <Section title="1. Services Provided">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Doctors.Online provides an online platform connecting patients with doctors for appointment booking, teleconsultations, and healthcare services.</li>
            <li>We are not a healthcare provider. Responsibility for medical advice, diagnosis, and treatment lies solely with the respective doctor or healthcare professional.</li>
          </ul>
        </Section>

        <Section title="2. User Eligibility">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>You must be at least 18 years old to use our services.</li>
            <li>By booking an appointment, you confirm that the information provided is true, accurate, and complete.</li>
          </ul>
        </Section>

        <Section title="3. Appointment Booking, Payments & Cancellations">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>To confirm an appointment, patients must pay a <span className="font-medium">booking fee of ₹99</span>.</li>
            <li>If cancelled <span className="font-medium">at least 1 hour before</span>, the booking fee is refundable.</li>
            <li>Cancellations made <span className="font-medium">less than 1 hour before</span> are non-refundable.</li>
            <li>Appointment confirmation is subject to doctor availability.</li>
            <li>We are not responsible for delays, last-minute cancellations, or no-shows.</li>
          </ul>
        </Section>

        <Section title="4. Refund Policy">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Refunds, if applicable, will be processed back to the original payment method within <span className="font-medium">5–7 business days</span>.</li>
            <li>We are not liable for delays caused by banks, payment gateways, or third-party services.</li>
          </ul>
        </Section>

        <Section title="5. Limitation of Liability">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Doctors.Online is a facilitator and does not guarantee the accuracy, quality, or outcomes of medical consultations.</li>
            <li>We are not liable for medical negligence, misdiagnosis, or treatment issues.</li>
          </ul>
        </Section>

        <Section title="6. User Responsibilities">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Provide accurate medical history and information when booking consultations.</li>
            <li>Do not misuse the platform for fraudulent, harmful, or unlawful purposes.</li>
          </ul>
        </Section>

        <Section title="7. Privacy & Data Protection">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Your personal and medical information will be handled in accordance with our <span className="font-medium">Privacy Policy</span>.</li>
            <li>By using our services, you consent to the collection and processing of your information.</li>
          </ul>
        </Section>

        <Section title="8. Intellectual Property">
          <p className="text-gray-700">
            All content, logos, and designs on Doctors.Online are our intellectual property and cannot be used without prior written consent.
          </p>
        </Section>

        <Section title="9. Termination of Services">
          <p className="text-gray-700">
            We reserve the right to suspend or terminate your access if you violate these Terms and Conditions.
          </p>
        </Section>

        <Section title="10. Google Play Console Terms & Conditions">
          <p className="text-gray-700 mb-2">
            When using our <span className="font-medium">Doctors.Online mobile application</span>, you also agree to abide by Google Play Console’s policies:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Compliance with Google Play Developer Program Policies and Developer Distribution Agreement.</li>
            <li>No uploading of harmful, abusive, or misleading content.</li>
            <li>No violation of intellectual property rights.</li>
            <li>Proper handling of user data in compliance with Google Play’s User Data Policy.</li>
            <li>Any violation may lead to suspension or removal of the app from the Play Store.</li>
          </ul>
        </Section>

        <Section title="11. Governing Law">
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes will be subject to the exclusive jurisdiction of the Indian courts.
          </p>
        </Section>

        <Section title="12. Changes to Terms">
          <p className="text-gray-700">
            We may update these Terms periodically. Continued use of the platform after updates constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section title="Contact Us">
          <p className="text-gray-700">
            For questions or concerns, please contact us at:
          </p>
          <p className="mt-2 font-medium">Email: doctoronline366@gmail.com</p>
        </Section>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-[#4d91ff] mb-2">{title}</h2>
    <div className="text-gray-700">{children}</div>
  </div>
);

export default TermsConditionsPage;
