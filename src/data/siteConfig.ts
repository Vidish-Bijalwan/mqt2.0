// Central site configuration for My Quick Trippers / MQT India
// Update this file to change brand details across the entire site

export const siteConfig = {
  name: "My Quick Trippers",
  shortName: "MQT India",
  tagline: "Your Journey, Our Expertise",
  description:
    "My Quick Trippers (MQT India) offers curated India & international tour packages with expert guidance, best prices, and 24/7 support. Book your dream holiday today!",
  domain: "https://www.myquicktrippers.com",
  email: "info@myquicktrippers.com",
  phone: "+91-8171158569",
  phoneRaw: "8171158569",
  whatsapp: "+918171158569",
  whatsappDisplay: "+91-8171158569",
  address: {
    street: "India",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    pin: "110001",
    full: "New Delhi, India",
  },
  logo: "/logo/mqt-india-logo.png",
  logoAlt: "My Quick Trippers - MQT India Logo",
  social: {
    facebook: "https://www.facebook.com/myquicktrippers",
    instagram: "https://www.instagram.com/myquicktrippers",
    twitter: "https://x.com/myquicktrippers",
    youtube: "https://www.youtube.com/@myquicktrippers",
    linkedin: "https://www.linkedin.com/company/myquicktrippers",
    whatsapp: "https://wa.me/918171158569",
  },
  offices: {
    head: "New Delhi, India",
    branches: ["Delhi", "Hyderabad", "Pune", "Kashmir", "Bengaluru", "Dehradun"],
    overseas: ["USA", "Sri Lanka", "Nepal"],
  },
  stats: {
    yearsExperience: 10,
    happyTravellers: "50,000+",
    tourPackages: "500+",
    destinations: "100+",
    teamMembers: "100+",
  },
} as const;

export type SiteConfig = typeof siteConfig;
