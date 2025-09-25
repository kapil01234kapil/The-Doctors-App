"use client";

import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4d91ff] mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Doctor. Online operates the website <span className="font-medium">www.doctor.online</span> and related mobile apps. Our services provide an online platform for booking appointments with healthcare professionals, accessing medical advice, and managing health-related information, similar to platforms like Practo.
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed">
          This Privacy Policy explains how we collect, use, share, disclose, and protect personal information about our users, including patients (End-Users), healthcare practitioners (Practitioners), and visitors to the Website. By using our Services or providing us with your information, you agree to the practices described in this Privacy Policy and our Terms of Use. Continued use of the Services after changes constitutes acceptance of the updated policy.
        </p>

        {/* Sections */}
        <Section title="Why This Privacy Policy?">
          <p className="mb-3">
            This Privacy Policy complies with applicable data protection laws, including but not limited to the Information Technology Act, 2000, and related rules in India. It outlines:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Types of personal information we collect, including sensitive data.</li>
            <li>Purposes and methods of using such information.</li>
            <li>How and with whom we share this information.</li>
            <li>Your rights regarding your data.</li>
          </ul>
        </Section>

        <Section title="Collection of Personal Information">
          <p className="mb-3">
            We may collect personal information that identifies you or could be used to identify you, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            <li>Contact details: email, phone number, address.</li>
            <li>Demographic info: age, gender, date of birth, location.</li>
            <li>Health data: medical history, appointment details, symptoms.</li>
            <li>Payment info: credit/debit card details, bank info.</li>
            <li>Usage data: browsing history, appointment history.</li>
            <li>Device info: IP address, browser type, OS.</li>
            <li>Voluntary info: feedback, emails, uploaded documents.</li>
          </ul>
          <p className="mb-3">
            Sensitive personal data includes health conditions, medical records, biometric or financial details. We collect this only with your consent and for purposes outlined above.
          </p>
          <p>
            Collection methods include registration, appointment bookings, interactions with support, cookies, and third-party integrations (with your permission).
          </p>
        </Section>

        <Section title="Use of Personal Information">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Provide and improve Services: appointment bookings, virtual consultations, health record management.</li>
            <li>Personalize experience: recommend practitioners/services.</li>
            <li>Process payments securely.</li>
            <li>Communicate updates, reminders, newsletters.</li>
            <li>Internal research and analytics in anonymized form.</li>
            <li>Comply with legal obligations and prevent fraud.</li>
            <li>Marketing, with opt-out options.</li>
          </ul>
        </Section>

        <Section title="Sharing and Disclosure of Information">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>With healthcare practitioners or clinics for appointment fulfillment.</li>
            <li>Service providers (payment processors, cloud storage) under confidentiality agreements.</li>
            <li>Affiliates or partners for joint services, with your consent.</li>
            <li>For legal reasons: court orders, government requests, or to protect rights.</li>
            <li>During merger, acquisition, or asset sale.</li>
            <li>In aggregated/de-identified form for research or marketing.</li>
          </ul>
        </Section>

        <Section title="Data Security">
          <p className="text-gray-700 mb-3">
            We prioritize the security of your data and implement reasonable measures, including encryption, access controls, and security audits. However, no system is completely secure.
          </p>
        </Section>

        <Section title="User Rights">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Access: Request a copy of your data.</li>
            <li>Correction: Update inaccurate information.</li>
            <li>Deletion: Request removal, subject to legal retention.</li>
            <li>Opt-Out: Withdraw consent for marketing or certain uses.</li>
            <li>Portability: Receive your data in structured format.</li>
            <li>Objection: Object to processing in certain cases.</li>
          </ul>
          <p className="mt-2">
            Contact us at <span className="font-medium">privacy@doctor.online</span> to exercise these rights.
          </p>
        </Section>

        <Section title="Cookies and Tracking Technologies">
          <p className="text-gray-700">
            We use cookies and similar technologies to enhance experience, analyze usage, and deliver targeted ads. Manage preferences via your browser settings.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p className="text-gray-700">
            Our Services are not intended for children under 18. We do not knowingly collect data from minors.
          </p>
        </Section>

        <Section title="International Data Transfers">
          <p className="text-gray-700">
            Users accessing our Services from outside India may have their data transferred to India or other countries, with safeguards in place.
          </p>
        </Section>

        <Section title="Changes to This Privacy Policy">
          <p className="text-gray-700">
            We may update this policy periodically. Changes will be posted on the Website.
          </p>
        </Section>

        <Section title="Contact Us">
          <p className="text-gray-700">
            For questions regarding this Privacy Policy, contact our Data Protection Officer:
          </p>
          <p className="mt-2 font-medium">Email: doctoronline336@gmail.com</p>
        </Section>

        <p className="mt-6 text-gray-700">
          By using Doctor. Online Services, you acknowledge that you have read and understood this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

// Helper component for section headers
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-[#4d91ff] mb-2">{title}</h2>
    <div className="text-gray-700">{children}</div>
  </div>
);

export default PrivacyPolicyPage;
