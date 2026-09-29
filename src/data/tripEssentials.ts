/**
 * MQT's official standard booking terms for package pages (Feature A).
 *
 * Transcribed verbatim from the company's own
 * "MQT India Terms & Conditions (1).docx" — this is MQT India's real
 * cancellation and pricing policy, NOT scraped content and NOT invented.
 * It applies to every booking, so the package template shows it whenever a
 * package has no plan-specific terms of its own.
 */

export interface CancellationTier {
  /** When the traveller cancels, relative to departure. */
  deadline: string;
  /** How much of the total package cost is charged. */
  charge: string;
}

export const mqtStandardCancellationTiers: CancellationTier[] = [
  { deadline: "More than 30 days before departure", charge: "20% of the total package cost" },
  { deadline: "30–16 days before departure", charge: "50% of the total package cost" },
  { deadline: "15–8 days before departure", charge: "75% of the total package cost" },
  { deadline: "Within 7 days of departure or No Show", charge: "100% of the package cost" },
];

export const mqtStandardCancellationNotes: string[] = [
  "Flight/train tickets, permits, and hotel bookings made on a non-refundable basis are charged as per supplier policies.",
];

export const mqtStandardRefundNotes: string[] = [
  "Refunds, wherever applicable, are processed within 15–30 working days after receiving the cancellation request.",
  "Bank charges, payment gateway charges, and cancellation charges are non-refundable.",
  "Refunds are made only to the original payment source.",
];

/**
 * Pricing terms from the same official document (section 2, "Pricing").
 * Used for the price-clarity panel — explains plainly what can and cannot
 * change about a shown price.
 */
export const mqtStandardPriceTerms: string[] = [
  "All package prices are quoted in Indian Rupees (INR).",
  "Prices are subject to change before booking confirmation due to changes in fuel costs, taxes, permits, accommodation tariffs, or government regulations.",
  "Once the booking is confirmed and full payment is received, the agreed package price will remain fixed unless government-imposed charges change.",
];
