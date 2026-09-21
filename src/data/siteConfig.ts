// Central site configuration for My Quick Trippers / MQT India
// Update this file to change brand details across the entire site

export const siteConfig = {
  name: "My Quick Trippers",
  shortName: "MQT India",
  tagline: "India Tour Packages, Himachal, Dubai, Chardham Yatra & More",
  description:
    "Best India tour packages: Himachal, Dubai, Chardham Yatra, Nainital, Buddhist Tours, Helicopter Tours, Shimla honeymoon, Dehradun adventure. Expert guidance, best prices, 24/7 support.",
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
    instagram: "https://www.instagram.com/mqt_india/",
    twitter: "https://x.com/mqt_india",
    youtube: "https://www.youtube.com/@myquicktrippers",
    linkedin: "https://www.linkedin.com/in/myquicktrippers-india-579069427/",
    whatsapp: "https://wa.me/918171158569",
  },
  offices: {
    head: "Delhi, India",
    branches: ["Delhi", "Bangalore", "Chennai", "Dehradun", "Kolkata"],
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
