import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/ui/LegalPage";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "Read My Quick Trippers (MQT India) privacy policy. Learn how we collect, use, disclose, and safeguard your personal information when you book travel with us.",
};

const sections: LegalSection[] = [
  {
    title: "Our Commitment",
    body: [
      "MQT India (My Quick Trippers) values your privacy and is committed to protecting your personal information. This policy explains how we collect, use, disclose, and safeguard information when you use our travel services or website.",
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "Personal details, contact information, identity documents required for bookings, payment information processed through secure providers, travel preferences, emergency contacts (when required), and communications with our team.",
    ],
  },
  {
    title: "Purpose of Collection",
    body: [
      "To confirm bookings, arrange transport and accommodation, provide customer support, process payments, comply with legal obligations, improve services, and send promotional communications where permitted.",
    ],
  },
  {
    title: "Information Sharing",
    body: [
      "Information is shared only with hotels, transport providers, airlines, guides, insurance providers, payment gateways, and government authorities when necessary for travel arrangements or legal compliance. We never sell customer data.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "Industry-standard administrative, technical, and physical safeguards are used to protect your information from unauthorized access, alteration, disclosure, or destruction.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "Our website may use cookies and analytics technologies to enhance user experience and improve website performance.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You may request access, correction, or deletion of your information, subject to applicable laws and contractual or regulatory obligations.",
    ],
  },
  {
    title: "Retention",
    body: [
      "Records are retained only as long as necessary for operational, legal, taxation, and regulatory requirements.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "Third-party websites and services have independent privacy practices. Please review their policies before sharing personal information.",
    ],
  },
  {
    title: "Policy Updates",
    body: [
      "MQT India may revise this Privacy Policy periodically. The updated version will be published and become effective upon posting.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "MQT India (My Quick Trippers)",
      "Website: myquicktrippers.com",
      `Email: Use the official contact details published on our website — ${siteConfig.email} or call us at ${siteConfig.phone}.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="MQT India (My Quick Trippers) values your privacy and is committed to protecting your personal information."
      effectiveDate="03 August 2026"
      sections={sections}
    />
  );
}
