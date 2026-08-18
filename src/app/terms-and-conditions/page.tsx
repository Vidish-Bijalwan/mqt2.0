import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/ui/LegalPage";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description:
    "Read My Quick Trippers (MQT India) booking terms and conditions — booking confirmation, pricing, cancellation & refund policy, force majeure, traveller responsibilities and more.",
};

const sections: LegalSection[] = [
  {
    title: "Booking Confirmation",
    body: [
      "A booking is considered confirmed only after receipt of the required advance payment.",
      "The balance amount must be paid before the tour departure as communicated by MQT India.",
      "Failure to complete payment within the stipulated time may result in cancellation of the booking.",
    ],
  },
  {
    title: "Pricing",
    body: [
      "All package prices are quoted in Indian Rupees (INR).",
      "Prices are subject to change before booking confirmation due to changes in fuel costs, taxes, permits, accommodation tariffs, or government regulations.",
      "Once the booking is confirmed and full payment is received, the agreed package price will remain fixed unless government-imposed charges change.",
    ],
  },
  {
    title: "Package Inclusions & Exclusions",
    body: [
      'Only the services specifically mentioned under "Package Includes" are included.',
      "Personal expenses such as laundry, tips, beverages, shopping, optional activities, room service, medical expenses, insurance, and anything not mentioned under inclusions are excluded.",
    ],
  },
  {
    title: "Cancellation Policy",
    body: [
      "Cancellation charges shall apply as follows:",
      "More than 30 days before departure: 20% of the total package cost.",
      "30–16 days before departure: 50% of the total package cost.",
      "15–8 days before departure: 75% of the total package cost.",
      "Within 7 days of departure or No Show: 100% of the package cost.",
      "Flight/train tickets, permits, and hotel bookings made on a non-refundable basis will be charged as per supplier policies.",
    ],
  },
  {
    title: "Refund Policy",
    body: [
      "Refunds, wherever applicable, will be processed within 15–30 working days after receiving the cancellation request.",
      "Bank charges, payment gateway charges, and cancellation charges are non-refundable.",
      "Refunds will be made only to the original payment source.",
    ],
  },
  {
    title: "Tour Changes",
    body: [
      "MQT India reserves the right to modify the itinerary, hotels, transportation, or sightseeing due to weather conditions, road closures, natural disasters, political situations, government restrictions, operational requirements, or any unforeseen circumstances.",
      "Equivalent alternatives will be provided wherever possible.",
    ],
  },
  {
    title: "Force Majeure",
    body: [
      "MQT India shall not be held liable for delays, cancellations, losses, or additional expenses arising from:",
      "Natural disasters, landslides, floods, earthquakes, heavy snowfall, pandemics, war, civil unrest, government restrictions, transport strikes, or any event beyond the company's reasonable control.",
    ],
  },
  {
    title: "Accommodation",
    body: [
      "Hotel check-in/check-out timings shall be as per hotel policy.",
      "Similar category accommodation may be provided if the booked hotel becomes unavailable.",
      "Early check-in and late check-out are subject to availability and additional charges.",
    ],
  },
  {
    title: "Transportation",
    body: [
      "Vehicle allocation is based on the package and group size.",
      "Air conditioning in vehicles may be switched off during steep hill climbs or when required for vehicle safety.",
      "Seat allocation is on a first-booked basis unless otherwise specified.",
    ],
  },
  {
    title: "Traveller Responsibilities",
    body: [
      "Travellers must:",
      "Carry valid government-issued photo identification.",
      "Arrive at departure points on time.",
      "Follow instructions issued by the tour manager or driver.",
      "Respect local customs, laws, and environmental regulations.",
      "Avoid carrying prohibited or illegal items.",
    ],
  },
  {
    title: "Health & Fitness",
    body: [
      "Guests are responsible for ensuring they are medically fit for the tour.",
      "Trekking and adventure activities involve inherent risks and participation is voluntary.",
      "MQT India is not responsible for any illness, injury, or medical emergency arising from pre-existing conditions or personal negligence.",
    ],
  },
  {
    title: "Travel Insurance",
    body: [
      "Travel insurance is strongly recommended for all tours.",
      "MQT India shall not be responsible for losses arising from cancellation, medical emergencies, baggage loss, or accidents not covered by the company.",
    ],
  },
  {
    title: "Liability",
    body: [
      "MQT India acts only as a tour organizer and coordinates services provided by hotels, transport operators, airlines, guides, activity providers, and other independent suppliers.",
      "MQT India shall not be liable for delays, cancellations, deficiencies, or losses caused by third-party service providers beyond its reasonable control.",
    ],
  },
  {
    title: "Behaviour Policy",
    body: [
      "MQT India reserves the right to remove any traveller from the tour without refund if their behaviour is abusive, illegal, unsafe, intoxicated, violent, or disruptive to other guests or staff.",
    ],
  },
  {
    title: "Photography & Media",
    body: [
      "Photographs or videos taken during tours may be used by MQT India for promotional purposes unless the traveller informs the company in writing before the tour.",
    ],
  },
  {
    title: "Complaints",
    body: [
      "Any complaint must be reported immediately to the Tour Coordinator during the tour to allow an opportunity for resolution.",
      "Complaints submitted after completion of the tour may not be entertained if they could have been addressed during the trip.",
    ],
  },
  {
    title: "Jurisdiction",
    body: [
      "All disputes shall be governed by the laws of India.",
      "Courts having jurisdiction at Dehradun, Uttarakhand, shall have exclusive jurisdiction over any disputes arising from the booking or tour.",
    ],
  },
  {
    title: "Acceptance",
    body: [
      "Payment of any booking amount constitutes acceptance of these Terms & Conditions.",
      "Travellers confirm that they have read, understood, and agreed to all booking conditions before making the reservation.",
    ],
  },
  {
    title: "Complimentary Local Craft Gift",
    body: [
      "As a token of appreciation, MQT India is delighted to offer a Complimentary Authentic Local Handicraft Gift with eligible bookings.",
      "Guests booking a tour package with a total booking value of ₹1,00,000 or above will receive a complimentary handcrafted souvenir inspired by the destination's local art and culture.",
      "Gifts may include locally crafted wooden artifacts, handmade décor, traditional textiles, regional handicrafts, eco-friendly souvenirs, or other artisan-made products.",
      "The gift is selected by MQT India based on destination, availability, and local craftsmanship.",
      "Complimentary gifts are presented once per eligible booking (unless otherwise specified in a promotional offer).",
      "The gift has no cash value and cannot be exchanged, transferred, upgraded, or redeemed for cash, discounts, or any other service.",
      "In case a particular handicraft is unavailable, MQT India reserves the right to provide an alternative gift of similar value and quality.",
      "This offer may be modified, replaced, or withdrawn for future bookings without prior notice; however, confirmed eligible bookings will continue to receive the applicable complimentary gift.",
      "At MQT India (My Quick Trippers), we believe every journey should create lasting memories. Along with unforgettable travel experiences, we proudly support local artisans by gifting authentic handcrafted souvenirs that celebrate India's rich cultural heritage. Your journey not only creates memories but also contributes to sustaining traditional craftsmanship and local communities.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      subtitle="Please read these booking terms and conditions carefully before making a reservation with MQT India (My Quick Trippers)."
      effectiveDate="03 August 2026"
      sections={sections}
    />
  );
}
