export interface EnquiryDetails {
  packageName?: string;
  name: string;
  email?: string;
  phone: string;
  travelDate?: string;
  travellers?: string;
  message?: string;
  ref?: string | null;
}

export function buildEnquiryWhatsappUrl(baseUrl: string, details: EnquiryDetails) {
  const message = [
    "Hello My Quick Trippers, I would like a quote.",
    details.ref ? `Reference: ${details.ref}` : "",
    details.packageName ? `Package: ${details.packageName}` : "",
    `Name: ${details.name}`,
    details.email ? `Email: ${details.email}` : "",
    `Phone: ${details.phone}`,
    details.travelDate ? `Travel date: ${details.travelDate}` : "",
    details.travellers ? `Travellers: ${details.travellers}` : "",
    details.message ? `Message: ${details.message}` : "",
  ].filter(Boolean).join("\n");

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
