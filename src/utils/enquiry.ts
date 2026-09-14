export interface EnquiryDetails {
  packageName?: string;
  name: string;
  email: string;
  phone: string;
  travelDate?: string;
  travellers?: string;
  message?: string;
}

export function buildEnquiryWhatsappUrl(baseUrl: string, details: EnquiryDetails) {
  const message = [
    "Hello My Quick Trippers, I would like a quote.",
    details.packageName ? `Package: ${details.packageName}` : "",
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    details.travelDate ? `Travel date: ${details.travelDate}` : "",
    details.travellers ? `Travellers: ${details.travellers}` : "",
    details.message ? `Message: ${details.message}` : "",
  ].filter(Boolean).join("\n");

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
