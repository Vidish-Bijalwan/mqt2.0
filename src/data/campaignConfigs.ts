import { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";
import type { Package } from "@/data/allPackages";
import { getPublicPackages, isInternationalPackage } from "@/utils/packageCatalog";

export type CampaignTheme =
  | "amber"
  | "orange"
  | "blue"
  | "sky"
  | "green"
  | "teal"
  | "pink";

export interface CampaignDestination {
  name: string;
  description: string;
  image: string;
  /** Badge text rendered top-right over the image (e.g. location, altitude, difficulty). */
  badge?: string;
  /** Rendered as "📍 {location}" grey line under the description (chardham). */
  location?: string;
  /** Secondary meta line (e.g. "Best Season: ...", "Altitude: ..."). */
  metaLine?: string;
  /** true -> text-gray-500; false/undefined -> theme-colored. */
  metaLineGray?: boolean;
  /** Colored font-medium line (buddhist, chardham). */
  significance?: string;
  /** Chip row (dubai, helicopter, nainital). */
  chips?: string[];
  /** Margin under the description when more content follows: "mb-2" | "mb-3". */
  descriptionMb?: "mb-2" | "mb-3";
}

export interface CampaignConfig {
  slug: string;
  theme: CampaignTheme;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogImageAlt: string;
  };
  heroImage: string;
  heroImageAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  /** First button (href="#packages"). Full literal className so output is byte-identical. */
  heroPrimaryBtn: { text: string; className: string };
  /** Second button (href="#enquiry"). */
  heroSecondaryBtn: { text: string; className: string };
  benefits: {
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
    /** Optional full-literal card className override (chardham uses white cards here). */
    cardClassName?: string;
  };
  destinations: {
    title: string;
    subtitle: string;
    items: CampaignDestination[];
    /** Render destinations before benefits (chardham only). */
    first?: boolean;
    /** Render as linked overlay cards (himachal only). */
    overlayLinks?: boolean;
    /** Full literal grid class for the destination cards (chardham uses lg:grid-cols-4). */
    gridClassName?: string;
  };
  packages: {
    filter: (pkg: Package) => boolean;
    title: string;
    subtitle: string;
    emptyText: string;
    emptyLinkText: string;
  };
  /** Omitted for campaigns without a tips section (himachal). */
  tips?: {
    title: string;
    subtitle: string;
    items: string[];
    bullet: string;
  };
  faqSubtitle: string;
  faqs: { question: string; answer: string }[];
  enquiry: { title: string; subtitle: string; destination: string };
  cta: {
    title: string;
    text: string;
    sectionClassName: string;
    titleClassName: string;
    textClassName: string;
    callButtonClassName: string;
  };
  jsonLd: {
    description: string;
    priceRange: string;
    areaServed: string[];
    catalogName: string;
    touristType: string[];
  };
}

export function buildCampaignMetadata(config: CampaignConfig): Metadata {
  return {
    title: config.metadata.title,
    description: config.metadata.description,
    keywords: config.metadata.keywords,
    alternates: {
      canonical: `${siteConfig.domain}/campaigns/${config.slug}`,
    },
    openGraph: {
      title: config.metadata.ogTitle,
      description: config.metadata.ogDescription,
      url: `${siteConfig.domain}/campaigns/${config.slug}`,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: `${siteConfig.domain}${config.metadata.ogImage}`,
          width: 1200,
          height: 630,
          alt: config.metadata.ogImageAlt,
        },
      ],
    },
  };
}

export function getCampaignPackages(config: CampaignConfig): Package[] {
  return getPublicPackages().filter(config.packages.filter).slice(0, 12);
}

export const buddhistToursConfig: CampaignConfig = {
  slug: "buddhist-tours-india",
  theme: "amber",
  metadata: {
    title: "Buddhist Tours India - Buddhist Pilgrimage Packages | My Quick Trippers",
    description: "Book Buddhist Tours India with My Quick Trippers. Buddhist pilgrimage packages to Bodh Gaya, Sarnath, Kushinagar, Lumbini. Buddhist circuit tours, spiritual journeys. Best prices.",
    keywords: [
      "Buddhist Tours India",
      "Buddhist pilgrimage packages",
      "Buddhist circuit India",
      "Bodh Gaya tour packages",
      "Sarnath tour packages",
      "Kushinagar tour packages",
      "Lumbini tour packages",
      "Buddhist spiritual tours",
      "Buddhist heritage sites",
      "Buddhist temple tours",
      "India Buddhist pilgrimage",
      "Buddhist tourism India",
      "Buddhist circuit tour",
      "Buddhist monasteries India",
      "Buddhist heritage tour"
    ],
    ogTitle: "Buddhist Tours India - Buddhist Pilgrimage Packages",
    ogDescription: "Book Buddhist Tours India with My Quick Trippers. Buddhist pilgrimage packages to Bodh Gaya, Sarnath, Kushinagar, Lumbini.",
    ogImage: "/images/packages/sarnath.webp",
    ogImageAlt: "Buddhist Tours India - Buddhist Pilgrimage Sites",
  },
  heroImage: "/images/packages/buddhist-tour.jpg",
  heroImageAlt: "Buddhist Tours India - Ancient Buddhist Temples and Monasteries",
  heroTitle: "Buddhist Tours India",
  heroSubtitle: "Follow the Path of Enlightenment",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-white hover:bg-gray-100 text-amber-900 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Begin Your Journey",
    className: "bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Buddhist Tours?",
    subtitle: "Experience spiritual transformation along the sacred path of Buddha",
    items: [
      { icon: "🙏", title: "Spiritual Awakening", description: "Follow Buddha's footsteps to enlightenment" },
      { icon: "🏛️", title: "Ancient Heritage", description: "Explore UNESCO World Heritage Buddhist sites" },
      { icon: "🧘", title: "Meditation Retreats", description: "Experience peace at ancient meditation sites" },
      { icon: "📿", title: "Buddhist Philosophy", description: "Learn about Buddha's teachings and philosophy" },
      { icon: "🏔️", title: "Sacred Landscapes", description: "Journey through spiritually significant regions" },
      { icon: "🌸", title: "Cultural Immersion", description: "Experience Buddhist traditions and monastic life" },
    ],
  },
  destinations: {
    title: "Sacred Buddhist Sites",
    subtitle: "Journey to the most important places in Buddha's life",
    items: [
      { name: "Bodh Gaya", description: "Where Buddha attained enlightenment - Mahabodhi Temple", badge: "Bihar", significance: "Most sacred Buddhist site, UNESCO World Heritage", image: "/images/packages/bodh-gaya.jpg", descriptionMb: "mb-2" },
      { name: "Sarnath", description: "Where Buddha gave first sermon - Dhamek Stupa", badge: "Uttar Pradesh", significance: "Birthplace of Buddhist Sangha", image: "/images/packages/sarnath.webp", descriptionMb: "mb-2" },
      { name: "Kushinagar", description: "Where Buddha attained Mahaparinirvana - Parinirvana Stupa", badge: "Uttar Pradesh", significance: "Final resting place of Buddha", image: "/images/packages/kushinagar.webp", descriptionMb: "mb-2" },
      { name: "Lumbini", description: "Birthplace of Buddha - Maya Devi Temple", badge: "Nepal", significance: "Birthplace of Siddhartha Gautama", image: "/images/packages/lumbini.jpg", descriptionMb: "mb-2" },
      { name: "Rajgir", description: "Where Buddha spent many years - Gridhakuta Hill", badge: "Bihar", significance: "First Buddhist council site", image: "/images/packages/rajgir.jpg", descriptionMb: "mb-2" },
      { name: "Vaishali", description: "Where Buddha preached last sermon - Ashoka Pillar", badge: "Bihar", significance: "Second Buddhist council site", image: "/images/packages/vaishali.jpg", descriptionMb: "mb-2" },
    ],
  },
  packages: {
    filter: (pkg) =>
      pkg.title.toLowerCase().includes('buddhist') ||
      pkg.title.toLowerCase().includes('bodh gaya') ||
      pkg.title.toLowerCase().includes('sarnath') ||
      pkg.title.toLowerCase().includes('kushinagar') ||
      pkg.title.toLowerCase().includes('lumbini') ||
      pkg.title.toLowerCase().includes('pilgrimage') ||
      pkg.category === 'Pilgrimage',
    title: "Buddhist Pilgrimage Packages",
    subtitle: "Choose from our spiritually enriching Buddhist circuit tours and pilgrimage packages",
    emptyText: "No Buddhist tour packages currently available. Check back soon!",
    emptyLinkText: "View All Pilgrimage Packages →",
  },
  tips: {
    title: "Essential Buddhist Pilgrimage Tips",
    subtitle: "Important guidelines for a respectful and spiritually fulfilling journey",
    bullet: "✓",
    items: [
      "Best time: October to March for pleasant weather across Buddhist circuit",
      "Dress modestly when visiting temples and monasteries",
      "Remove shoes before entering temple premises",
      "Maintain silence and respect during meditation sessions",
      "Carry light woolens for winter months in northern regions",
      "Learn basic Buddhist etiquette before visiting monasteries",
      "Book accommodations in advance during Buddhist festivals",
      "Respect local customs and photography restrictions at religious sites",
    ],
  },
  faqSubtitle: "Everything you need to know about Buddhist pilgrimage tours",
  faqs: [
    {
      question: "What is the Buddhist Circuit in India?",
      answer: "The Buddhist Circuit is a pilgrimage route covering the most important sites in Buddha's life: Lumbini (birth), Bodh Gaya (enlightenment), Sarnath (first sermon), and Kushinagar (death). This sacred journey follows the footsteps of Siddhartha Gautama and attracts millions of pilgrims annually."
    },
    {
      question: "What is the best time to visit Buddhist sites in India?",
      answer: "The best time is from October to March when the weather is pleasant across the Buddhist circuit. Avoid extreme summer (April-June) and monsoon (July-September) seasons. Visit during Buddha Purnima (May) for special celebrations and ceremonies."
    },
    {
      question: "How many days are needed for Buddhist pilgrimage tours?",
      answer: "A comprehensive Buddhist circuit tour covering major sites requires 10-12 days. Focused tours to specific regions (Bodh Gaya-Sarnath, or Lumbini-Kushinagar) can be done in 5-7 days. Extended tours including Tibetan monasteries in Ladakh and Dharamshala require 15-20 days."
    },
    {
      question: "What are the must-visit Buddhist sites in India?",
      answer: "Must-visit sites include Bodh Gaya (Mahabodhi Temple, Bodhi Tree), Sarnath (Dhamek Stupa, Ashoka Pillar), Kushinagar (Parinirvana Stupa), Rajgir (Gridhakuta Hill), Vaishali (Ashoka Pillar), and Nalanda (ancient university). Don't miss the Tibetan monasteries in Dharamshala and Ladakh."
    },
    {
      question: "Are Buddhist pilgrimage tours suitable for international visitors?",
      answer: "Yes, Buddhist tours are very popular among international visitors. Many sites have English signage, guides are available in multiple languages, and accommodations cater to international travelers. The spiritual significance and historical importance make these sites universally appealing."
    },
    {
      question: "What is included in Buddhist tour packages?",
      answer: "Our Buddhist packages include accommodation in guesthouses/hotels near holy sites, transportation between destinations, guided tours to important temples and stupas, assistance with puja ceremonies, meals (mostly vegetarian), and spiritual guidance from experienced Buddhist guides."
    },
    {
      question: "What are the accommodation options near Buddhist sites?",
      answer: "Options range from basic dharamshalas and guesthouses to comfortable hotels and monastic stays. Bodh Gaya and Sarnath have good international hotel options. Some monasteries offer simple accommodation for pilgrims seeking an authentic spiritual experience."
    },
    {
      question: "What should I know about Buddhist temple etiquette?",
      answer: "Important etiquette includes dressing modestly (covered shoulders and knees), removing shoes before entering temples, maintaining silence, not pointing feet at Buddha images, asking permission before photography, and being respectful during prayer and meditation sessions. Many sites have specific dress codes."
    },
  ],
  enquiry: {
    title: "Begin Your Spiritual Journey",
    subtitle: "Let our experts help you plan a transformative Buddhist pilgrimage. Experience the peace and wisdom of Buddha's sacred path.",
    destination: "Buddhist Pilgrimage",
  },
  cta: {
    title: "Walk the Path of Enlightenment",
    text: "Book your Buddhist pilgrimage tour today and experience spiritual transformation along the sacred Buddhist circuit.",
    sectionClassName: "py-12 bg-amber-500",
    titleClassName: "text-2xl md:text-3xl font-bold text-white mb-4",
    textClassName: "text-amber-100 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-white hover:bg-gray-100 text-amber-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Buddhist Tours India - Buddhist pilgrimage packages to Bodh Gaya, Sarnath, Kushinagar, Lumbini",
    priceRange: "$$",
    areaServed: ["Bodh Gaya", "Sarnath", "Kushinagar", "Lumbini", "Rajgir", "Vaishali", "Bihar", "Uttar Pradesh"],
    catalogName: "Buddhist Tours India",
    touristType: ["Pilgrimage", "Spiritual", "Cultural", "Educational"],
  },
};

export const chardhamYatraConfig: CampaignConfig = {
  slug: "chardham-yatra",
  theme: "orange",
  metadata: {
    title: "Chardham Yatra Packages - Best Yamunotri Gangotri Kedarnath Badrinath Tours",
    description: "Book sacred Chardham Yatra packages with My Quick Trippers. Complete Yamunotri Gangotri Kedarnath Badrinath pilgrimage tours. Helicopter services, expert guidance, best prices.",
    keywords: [
      "Chardham Yatra",
      "Chardham Yatra packages",
      "Yamunotri Gangotri Kedarnath Badrinath",
      "Chardham pilgrimage tour",
      "Uttarakhand pilgrimage",
      "Char Dham Yatra by helicopter",
      "Chardham tour packages 2024",
      "Best Chardham Yatra packages",
      "Affordable Chardham Yatra",
      "Chardham Yatra from Delhi",
      "Chardham Yatra from Haridwar",
      "Sacred pilgrimage India",
      "Hindu pilgrimage sites",
      "Uttarakhand tourism",
      "Badrinath Kedarnath tour"
    ],
    ogTitle: "Chardham Yatra Packages - Sacred Pilgrimage Tours",
    ogDescription: "Book sacred Chardham Yatra packages with My Quick Trippers. Complete Yamunotri Gangotri Kedarnath Badrinath pilgrimage tours.",
    ogImage: "/images/packages/kedarnath.jpg",
    ogImageAlt: "Chardham Yatra - Sacred Pilgrimage Tour",
  },
  heroImage: "/images/packages/char-dham.jpg",
  heroImageAlt: "Chardham Yatra - Sacred Pilgrimage in Himalayas",
  heroTitle: "Chardham Yatra Packages",
  heroSubtitle: "Sacred Journey to Yamunotri, Gangotri, Kedarnath & Badrinath",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-white hover:bg-gray-100 text-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Plan Your Yatra",
    className: "bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Our Chardham Yatra?",
    subtitle: "Experience a spiritually enriching journey with comfort and devotion",
    cardClassName: "bg-white p-6 rounded-xl hover:shadow-lg transition-shadow border border-orange-100",
    items: [
      { icon: "🙏", title: "Sacred Pilgrimage", description: "Visit four most holy Hindu temples in the Himalayas" },
      { icon: "🏔️", title: "Himalayan Beauty", description: "Experience breathtaking mountain landscapes and scenic valleys" },
      { icon: "🚁", title: "Helicopter Options", description: "Choose helicopter services for convenient and quick darshan" },
      { icon: "🏨", title: "Comfortable Stay", description: "Quality accommodations and hygienic food throughout the journey" },
      { icon: "👨‍👩‍👧‍👦", title: "Family Friendly", description: "Safe and well-organized tours suitable for all age groups" },
      { icon: "📿", title: "Spiritual Experience", description: "Professional guides providing religious and historical insights" },
    ],
  },
  destinations: {
    title: "The Four Sacred Abodes",
    subtitle: "Journey to the holiest Hindu temples in the Himalayas",
    first: true,
    gridClassName: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12",
    items: [
      { name: "Yamunotri", description: "Source of Yamuna River - Dedicated to Goddess Yamuna", badge: "3,293m", location: "Uttarkashi district", significance: "First stop of Chardham Yatra, known for thermal springs", image: "/images/packages/yamunotri.webp", descriptionMb: "mb-2" },
      { name: "Gangotri", description: "Source of Ganges River - Dedicated to Goddess Ganga", badge: "3,100m", location: "Uttarkashi district", significance: "Most sacred river in Hinduism, temple near Bhagirathi River", image: "/images/packages/gangotri.webp", descriptionMb: "mb-2" },
      { name: "Kedarnath", description: "One of 12 Jyotirlingas - Dedicated to Lord Shiva", badge: "3,583m", location: "Rudraprayag district", significance: "Highest among Jyotirlingas, near Mandakini River", image: "/images/packages/kedarnath.jpg", descriptionMb: "mb-2" },
      { name: "Badrinath", description: "Dedicated to Lord Vishnu - Part of Char Dham", badge: "3,133m", location: "Chamoli district", significance: "Most important Vaishnavite temple, between Nar and Narayan mountains", image: "/images/packages/badrinath.jpg", descriptionMb: "mb-2" },
    ],
  },
  packages: {
    filter: (pkg) =>
      // Chardham only: the four dhams plus "do dham" combos. The old
      // `includes('pilgrimage')` / `category === 'Pilgrimage'` fallback
      // pulled in Amarnath, Buddhist and Tripura Sundari packages.
      pkg.title.toLowerCase().includes('char dham') ||
      pkg.title.toLowerCase().includes('chardham') ||
      pkg.title.toLowerCase().includes('do dham') ||
      pkg.title.toLowerCase().includes('dodham') ||
      pkg.title.toLowerCase().includes('yamunotri') ||
      pkg.title.toLowerCase().includes('gangotri') ||
      pkg.title.toLowerCase().includes('kedarnath') ||
      pkg.title.toLowerCase().includes('badrinath'),
    title: "Chardham Yatra Tour Packages",
    subtitle: "Choose from our carefully curated pilgrimage packages - road trips, helicopter tours, and custom itineraries",
    emptyText: "No Chardham packages currently available. Check back soon!",
    emptyLinkText: "View All Pilgrimage Packages →",
  },
  tips: {
    title: "Essential Yatra Tips",
    subtitle: "Important guidelines for a safe and spiritually fulfilling pilgrimage",
    bullet: "✓",
    items: [
      "Best time: May-June and September-October for pleasant weather",
      "Carry warm clothing as temperatures can drop significantly at high altitudes",
      "Start physical preparation 2-3 months before the yatra for fitness",
      "Carry essential medicines and first aid kit for high altitude conditions",
      "Book accommodations in advance, especially during peak season",
      "Respect local customs and dress modestly when visiting temples",
      "Stay hydrated and carry water purification tablets",
      "Keep emergency contacts and your tour operator details handy",
    ],
  },
  faqSubtitle: "Everything you need to know about Chardham Yatra",
  faqs: [
    {
      question: "What is the Chardham Yatra?",
      answer: "Chardham Yatra is a sacred pilgrimage tour covering four holy shrines in Uttarakhand: Yamunotri, Gangotri, Kedarnath, and Badrinath. It's believed that completing this yatra washes away all sins and helps attain moksha (liberation)."
    },
    {
      question: "What is the best time for Chardham Yatra?",
      answer: "The best time is during summer (May-June) when weather is pleasant, and post-monsoon (September-October) when skies are clear. Avoid monsoon (July-August) due to landslides and winter (November-April) when temples remain closed."
    },
    {
      question: "How long does the Chardham Yatra take?",
      answer: "A traditional Chardham Yatra takes 10-12 days by road. Helicopter tours can complete it in 4-5 days. The duration depends on the chosen mode of transport, weather conditions, and time spent at each temple."
    },
    {
      question: "Is Chardham Yatra suitable for senior citizens?",
      answer: "Yes, with proper preparation. Senior citizens should opt for helicopter packages to avoid strenuous trekking, carry medications, and choose tours with comfortable pacing. Medical fitness check is recommended before undertaking the journey."
    },
    {
      question: "What documents are required for Chardham Yatra?",
      answer: "Valid ID proof (Aadhar card, passport, etc.), medical certificate for senior citizens, and passport-size photographs are essential. Some areas may require inner line permits or forest permits which your tour operator will arrange."
    },
    {
      question: "What is included in Chardham Yatra packages?",
      answer: "Our packages include accommodation in hotels/ashrams, transportation (private vehicle or helicopter), meals (breakfast and dinner), temple darshan assistance, priest services for puja, and the support of experienced tour guides throughout the journey."
    },
    {
      question: "How difficult is the Chardham Yatra trek?",
      answer: "The difficulty varies. Yamunotri involves a 6km trek, Kedarnath has a 16km trek (or helicopter option), while Gangotri and Badrinath are accessible by road. Choose helicopter packages for easier access or prepare physically for the trekking routes."
    },
    {
      question: "What are the accommodation options during Chardham Yatra?",
      answer: "Options range from basic dharamshalas and guest houses to comfortable hotels and luxury resorts. We recommend booking quality accommodations in advance, especially near Kedarnath where options are limited due to terrain constraints."
    },
  ],
  enquiry: {
    title: "Begin Your Sacred Journey",
    subtitle: "Let our experts help you plan the perfect Chardham Yatra. Get personalized packages, helicopter options, and spiritual guidance.",
    destination: "Chardham Yatra",
  },
  cta: {
    title: "Embark on Your Spiritual Journey Today",
    text: "Book your Chardham Yatra package and experience divine blessings in the sacred Himalayas. Early booking recommended for best rates.",
    sectionClassName: "py-12 bg-white",
    titleClassName: "text-2xl md:text-3xl font-bold text-orange-900 mb-4",
    textClassName: "text-gray-600 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Chardham Yatra Packages - Sacred pilgrimage tours to Yamunotri Gangotri Kedarnath Badrinath",
    priceRange: "$$",
    areaServed: ["Uttarakhand", "Yamunotri", "Gangotri", "Kedarnath", "Badrinath", "Himalayas"],
    catalogName: "Chardham Yatra Packages",
    touristType: ["Pilgrimage", "Spiritual", "Family", "Senior Citizens"],
  },
};

export const dehradunAdventureConfig: CampaignConfig = {
  slug: "dehradun-adventure",
  theme: "orange",
  metadata: {
    title: "Dehradun Adventure Packages - Adventure Tours & Activities | My Quick Trippers",
    description: "Book Dehradun adventure packages with My Quick Trippers. Adventure tours, trekking, river rafting, camping, wildlife safaris. Best adventure activities, thrilling experiences, expert guides.",
    keywords: [
      "Dehradun adventure packages",
      "Dehradun adventure tours",
      "Adventure activities Dehradun",
      "Trekking packages Dehradun",
      "River rafting Dehradun",
      "Camping packages Dehradun",
      "Wildlife safari Dehradun",
      "Adventure sports Dehradun",
      "Dehradun trip packages",
      "Uttarakhand adventure tours",
      "Rishikesh adventure packages",
      "Mussoorie adventure tours",
      "Adventure weekend getaways",
      "Outdoor activities Dehradun",
      "Best adventure packages"
    ],
    ogTitle: "Dehradun Adventure Packages - Adventure Tours & Activities",
    ogDescription: "Book Dehradun adventure packages with My Quick Trippers. Adventure tours, trekking, river rafting, camping, wildlife safaris.",
    ogImage: "/images/packages/trekking.jpg",
    ogImageAlt: "Dehradun Adventure Packages - Adventure Activities in Uttarakhand",
  },
  heroImage: "/images/packages/dehradun-adventure.jpg",
  heroImageAlt: "Dehradun Adventure Packages - Adventure Activities in Uttarakhand",
  heroTitle: "Dehradun Adventure Packages",
  heroSubtitle: "Thrill and Excitement in the Doon Valley",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-white hover:bg-gray-100 text-orange-900 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Plan Your Adventure",
    className: "bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Dehradun for Adventure?",
    subtitle: "Experience the perfect blend of thrill, nature, and Himalayan beauty",
    items: [
      { icon: "🏔️", title: "Himalayan Terrain", description: "Perfect landscape for outdoor adventures and thrill activities" },
      { icon: "🌊", title: "River Adventures", description: "Ganges and Yamuna rivers offer world-class rafting experiences" },
      { icon: "🐅", title: "Wildlife Encounters", description: "Rajaji National Park - home to elephants, tigers, and diverse wildlife" },
      { icon: "⛺", title: "Camping Paradise", description: "Scenic campsites with stunning mountain and river views" },
      { icon: "🧗", title: "Adventure Sports", description: "Rock climbing, rappelling, zip-lining, and more for thrill seekers" },
      { icon: "🎯", title: "Expert Guidance", description: "Certified instructors and experienced guides for safe adventures" },
    ],
  },
  destinations: {
    title: "Adventure Activities",
    subtitle: "Thrilling experiences for every adventure enthusiast",
    items: [
      { name: "River Rafting", description: "Thrilling white-water rafting on Ganges and Yamuna rivers", badge: "Moderate to Extreme", metaLine: "Best Season: March-June, September-November", image: "/images/packages/river-rafting.jpg", descriptionMb: "mb-2" },
      { name: "Trekking Expeditions", description: "Scenic mountain treks from easy to challenging levels", badge: "Easy to Difficult", metaLine: "Best Season: March-June, September-November", image: "/images/packages/trekking.jpg", descriptionMb: "mb-2" },
      { name: "Wildlife Safari", description: "Rajaji National Park safari - elephants, tigers, and more", badge: "Easy", metaLine: "Best Season: November-June", image: "/images/packages/wildlife-safari.jpg", descriptionMb: "mb-2" },
      { name: "Camping Experiences", description: "Riverside and mountain camping under the stars", badge: "Easy", metaLine: "Best Season: March-June, September-November", image: "/images/packages/camping.jpg", descriptionMb: "mb-2" },
      { name: "Rock Climbing", description: "Professional rock climbing and rappelling adventures", badge: "Moderate", metaLine: "Best Season: March-June, September-November", image: "/images/packages/rock-climbing.jpg", descriptionMb: "mb-2" },
      { name: "Paragliding", description: "Soar over the mountains with certified instructors", badge: "Easy", metaLine: "Best Season: March-June, September-November", image: "/images/packages/paragliding.jpg", descriptionMb: "mb-2" },
    ],
  },
  packages: {
    filter: (pkg) =>
      pkg.title.toLowerCase().includes('dehradun') ||
      pkg.title.toLowerCase().includes('adventure') ||
      pkg.title.toLowerCase().includes('trekking') ||
      pkg.title.toLowerCase().includes('rafting') ||
      pkg.title.toLowerCase().includes('camping') ||
      pkg.title.toLowerCase().includes('rishikesh') ||
      pkg.title.toLowerCase().includes('mussoorie') ||
      pkg.category === 'Adventure' ||
      pkg.category === 'North India',
    title: "Dehradun Adventure Packages",
    subtitle: "Choose from our thrilling adventure packages - from beginner to expert level",
    emptyText: "No adventure packages currently available. Check back soon!",
    emptyLinkText: "View All Adventure Packages →",
  },
  tips: {
    title: "Essential Adventure Tips",
    subtitle: "Important guidelines for a safe and thrilling adventure experience",
    bullet: "🎯",
    items: [
      "Best time: March-June and September-November for optimal adventure conditions",
      "Book adventure activities in advance, especially during peak seasons",
      "Carry appropriate gear - comfortable shoes, quick-dry clothes, sunscreen",
      "Follow safety instructions from guides for all adventure activities",
      "Stay hydrated and carry energy snacks during outdoor activities",
      "Inform about any medical conditions before attempting adventure sports",
      "Choose difficulty levels based on your fitness and experience",
      "Respect nature and follow eco-friendly practices during outdoor activities",
    ],
  },
  faqSubtitle: "Everything you need to know about Dehradun adventure tours",
  faqs: [
    {
      question: "What adventure activities are available in Dehradun?",
      answer: "Dehradun offers diverse adventure activities including river rafting (Ganges, Yamuna), trekking (various difficulty levels), wildlife safaris (Rajaji National Park), camping (riverside, mountain), rock climbing, rappelling, paragliding, zip-lining, and bungee jumping. Each activity has different difficulty levels and seasonal availability."
    },
    {
      question: "What is the best time for adventure activities in Dehradun?",
      answer: "The best time is March-June (summer) for pleasant weather and September-November (post-monsoon) for clear skies and good river conditions. Avoid monsoon (July-August) due to safety concerns with water activities and landslides. Winter (December-February) is good for lower-altitude activities."
    },
    {
      question: "Is Dehradun suitable for adventure beginners?",
      answer: "Yes, Dehradun is perfect for adventure beginners. Most activities offer different difficulty levels from easy to extreme. Professional instructors provide training, safety briefings, and guidance. Beginners can start with easy treks, basic rafting, and simple camping before progressing to more challenging activities."
    },
    {
      question: "How safe are adventure activities in Dehradun?",
      answer: "Adventure activities in Dehradun are generally safe when conducted by certified operators with proper safety equipment and trained instructors. We work with reputable adventure companies that follow international safety standards. However, adventure sports carry inherent risks, so follow all safety instructions and choose appropriate difficulty levels."
    },
    {
      question: "What should I pack for Dehradun adventure trips?",
      answer: "Pack comfortable outdoor clothing, quick-dry fabrics, sturdy walking shoes/hiking boots, sunscreen, sunglasses, hat, insect repellent, personal medications, flashlight, power bank, and a small backpack. For specific activities like rafting, carry water shoes and dry clothes. Layering is essential due to temperature variations."
    },
    {
      question: "Are adventure activities suitable for families?",
      answer: "Many adventure activities in Dehradun are family-friendly. Easy treks, wildlife safaris, basic camping, and gentle rafting stretches are suitable for families with children. However, more extreme activities like difficult rafting, rock climbing, and paragliding have age and fitness restrictions. We can customize family adventure packages."
    },
    {
      question: "What is included in adventure packages?",
      answer: "Our adventure packages include accommodation (tents/hotels), meals (as specified), adventure equipment rental, professional guides/instructors, safety gear, transportation to activity sites, permits and fees, and basic first aid support. Premium packages include additional activities and better accommodation options."
    },
    {
      question: "Can we combine adventure activities with sightseeing?",
      answer: "Absolutely! Dehradun's location allows perfect combination of adventure and sightseeing. Combine rafting with Rishikesh visits, trekking with Mussoorie sightseeing, wildlife safaris with temple visits, and camping with local cultural experiences. We create balanced itineraries that offer both adventure and cultural exploration."
    },
  ],
  enquiry: {
    title: "Plan Your Adventure Trip",
    subtitle: "Get a customized quote for your Dehradun adventure package. Our experts will help you plan the perfect thrilling experience with safety and excitement.",
    destination: "Dehradun Adventure",
  },
  cta: {
    title: "Ready for Your Next Adventure?",
    text: "Book your Dehradun adventure package today and experience the thrill of Himalayan adventures. Safe, exciting, and unforgettable experiences await!",
    sectionClassName: "py-12 bg-orange-500",
    titleClassName: "text-2xl md:text-3xl font-bold text-white mb-4",
    textClassName: "text-orange-100 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-white hover:bg-gray-100 text-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Dehradun Adventure Packages - Adventure tours, trekking, river rafting, camping, wildlife safaris",
    priceRange: "$$",
    areaServed: ["Dehradun", "Rishikesh", "Mussoorie", "Rajaji National Park", "Uttarakhand"],
    catalogName: "Dehradun Adventure Packages",
    touristType: ["Adventure", "Family", "Group", "Solo Traveler"],
  },
};

export const dubaiTourPackagesConfig: CampaignConfig = {
  slug: "dubai-tour-packages",
  theme: "blue",
  metadata: {
    title: "Dubai Tour Packages - Best Dubai Travel Deals | My Quick Trippers",
    description: "Book premium Dubai tour packages with My Quick Trippers. Best Dubai travel deals, Burj Khalifa, desert safari, shopping tours. Visa assistance, best prices, 24/7 support.",
    keywords: [
      "Dubai tour packages",
      "Dubai travel packages",
      "Dubai holiday packages",
      "Dubai tourism packages",
      "Best Dubai tour packages",
      "Dubai trip packages",
      "Dubai vacation packages",
      "Dubai sightseeing tours",
      "Dubai desert safari packages",
      "Dubai shopping tours",
      "Dubai honeymoon packages",
      "Dubai family tour packages",
      "Dubai visa packages",
      "Dubai tour from India",
      "Affordable Dubai packages",
      "Dubai luxury tours"
    ],
    ogTitle: "Dubai Tour Packages - Premium Dubai Travel Deals",
    ogDescription: "Book premium Dubai tour packages with My Quick Trippers. Best Dubai travel deals, Burj Khalifa, desert safari, shopping tours.",
    ogImage: "/images/packages/dubai.webp",
    ogImageAlt: "Dubai Tour Packages - Burj Khalifa and Desert Safari",
  },
  heroImage: "/images/packages/dubai.webp",
  heroImageAlt: "Dubai Tour Packages - Burj Khalifa and Modern Skyline",
  heroTitle: "Dubai Tour Packages",
  heroSubtitle: "Experience Luxury & Adventure in the City of Gold",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-white hover:bg-gray-100 text-blue-900 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Get Free Quote",
    className: "bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Dubai?",
    subtitle: "Discover the perfect blend of modern luxury, Arabian culture, and thrilling adventures",
    items: [
      { icon: "🏗️", title: "Modern Architecture", description: "Futuristic skyscrapers and engineering marvels" },
      { icon: "🏜️", title: "Desert Adventures", description: "Thrilling dune bashing and traditional Bedouin experiences" },
      { icon: "🛍️", title: "Luxury Shopping", description: "World-class malls and traditional souks" },
      { icon: "🎡", title: "Entertainment Hub", description: "Theme parks, water parks, and nightlife" },
      { icon: "🍽️", title: "Culinary Excellence", description: "International cuisine and fine dining experiences" },
      { icon: "🏖️", title: "Beach Luxury", description: "Pristine beaches and water sports activities" },
    ],
  },
  destinations: {
    title: "Top Dubai Attractions",
    subtitle: "Must-visit landmarks and experiences in the emirate",
    items: [
      { name: "Burj Khalifa", description: "World's tallest building - observation deck and luxury experiences", image: "/images/packages/burj-khalifa.jpg", chips: ["124th floor observation", "At the Top experience", "Dubai Fountain views"], descriptionMb: "mb-3" },
      { name: "Desert Safari", description: "Adventure in Arabian desert - dune bashing, camel rides, BBQ dinner", image: "/images/packages/desert-safari.jpg", chips: ["Dune bashing", "Camel riding", "Traditional BBQ dinner"], descriptionMb: "mb-3" },
      { name: "Palm Jumeirah", description: "Artificial island - luxury resorts, beaches, and Atlantis", image: "/images/packages/palm-jumeirah.jpg", chips: ["Atlantis resort", "Palm monorail", "Beach activities"], descriptionMb: "mb-3" },
      { name: "Dubai Mall", description: "World's largest shopping mall - luxury brands, aquarium, entertainment", image: "/images/packages/dubai-mall.jpg", chips: ["1200+ stores", "Underwater zoo", "Ice rink"], descriptionMb: "mb-3" },
      { name: "Dubai Marina", description: "Waterfront district - luxury yachts, dining, skyline views", image: "/images/packages/dubai-marina.jpg", chips: ["Yacht cruises", "Fine dining", "Skyline views"], descriptionMb: "mb-3" },
      { name: "Old Dubai", description: "Historic district - souks, museums, traditional architecture", image: "/images/packages/old-dubai.jpg", chips: ["Gold Souk", "Spice Souk", "Dubai Museum"], descriptionMb: "mb-3" },
    ],
  },
  packages: {
    filter: (pkg) =>
      pkg.title.toLowerCase().includes('dubai') ||
      pkg.title.toLowerCase().includes('uae') ||
      pkg.title.toLowerCase().includes('abu dhabi') ||
      isInternationalPackage(pkg),
    title: "Dubai Tour Packages",
    subtitle: "Choose from our carefully curated Dubai packages - luxury, family, adventure, and budget options",
    emptyText: "No Dubai packages currently available. Check back soon!",
    emptyLinkText: "View All International Packages →",
  },
  tips: {
    title: "Essential Dubai Travel Tips",
    subtitle: "Important guidelines for a smooth and enjoyable Dubai experience",
    bullet: "✓",
    items: [
      "Best time: November to March for pleasant weather (20-30°C)",
      "Dress modestly in public areas, especially in religious sites",
      "Book Burj Khalifa tickets in advance to avoid queues",
      "Carry sunscreen and stay hydrated during outdoor activities",
      "Respect local customs during Ramadan (eating/drinking in public)",
      "Use metro for cost-effective transportation around the city",
      "Bargaining is expected in traditional souks but not in malls",
      "Friday is the holy day - many businesses close for Friday prayers",
    ],
  },
  faqSubtitle: "Everything you need to know about Dubai tours",
  faqs: [
    {
      question: "Do Indian citizens need a visa for Dubai?",
      answer: "Yes, Indian citizens require a visa to visit Dubai. We provide visa assistance services with our Dubai tour packages. The visa process typically takes 3-4 working days and requires passport copies, photographs, and confirmed hotel bookings."
    },
    {
      question: "What is the best time to visit Dubai?",
      answer: "The best time to visit Dubai is between November and March when the weather is pleasant (20-30°C). Summer months (June-August) are extremely hot (40-50°C) but offer great deals on hotels and activities. Consider visiting during Dubai Shopping Festival (January-February) for amazing deals."
    },
    {
      question: "How many days are ideal for a Dubai trip?",
      answer: "A typical Dubai trip requires 4-5 days to cover major attractions. For a comprehensive experience including desert safari, Abu Dhabi day trip, and luxury experiences, plan for 6-7 days. Short 3-day trips are possible for focused city tours."
    },
    {
      question: "What is included in Dubai tour packages?",
      answer: "Our Dubai packages include flight tickets, visa assistance, airport transfers, accommodation in quality hotels, selected sightseeing tours (Burj Khalifa, desert safari, city tour), daily breakfast, and the services of local guides. Premium packages include additional experiences and luxury accommodations."
    },
    {
      question: "Is Dubai family-friendly?",
      answer: "Absolutely! Dubai is one of the most family-friendly destinations with numerous attractions like Dubai Aquarium, KidZania, Miracle Garden, water parks, and safe beaches. Many hotels offer family rooms, kids' clubs, and child-friendly amenities."
    },
    {
      question: "What are the must-visit places in Dubai?",
      answer: "Must-visit places include Burj Khalifa (world's tallest building), Dubai Mall, Dubai Fountain, Palm Jumeirah, Dubai Marina, Desert Safari, Old Dubai (souks), and Dubai Frame. Don't miss the Dubai Fountain show and consider a day trip to Abu Dhabi for Sheikh Zayed Mosque."
    },
    {
      question: "What is the currency in Dubai and how should I manage money?",
      answer: "The currency is UAE Dirham (AED). Indian rupees are not accepted, so you'll need to carry Dirhams or use international credit/debit cards. ATMs are widely available. It's advisable to carry some cash for small purchases and tips."
    },
    {
      question: "What are the shopping options in Dubai?",
      answer: "Dubai offers world-class shopping from luxury malls (Dubai Mall, Mall of the Emirates) to traditional souks (Gold Souk, Spice Souk). Visit during Dubai Shopping Festival (January-February) for incredible discounts. Duty-free shopping is available at Dubai International Airport."
    },
  ],
  enquiry: {
    title: "Plan Your Dubai Dream Vacation",
    subtitle: "Get a customized quote for your Dubai tour package. Our experts will help you plan the perfect Dubai experience with visa assistance and best deals.",
    destination: "Dubai",
  },
  cta: {
    title: "Ready to Experience Dubai Luxury?",
    text: "Book your Dubai tour package today and experience the magic of the desert city. Best deals guaranteed with visa assistance!",
    sectionClassName: "py-12 bg-yellow-500",
    titleClassName: "text-2xl md:text-3xl font-bold text-white mb-4",
    textClassName: "text-yellow-100 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-white hover:bg-gray-100 text-yellow-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Dubai Tour Packages - Premium Dubai travel deals with Burj Khalifa, desert safari, shopping tours",
    priceRange: "$$$",
    areaServed: ["Dubai", "UAE", "Abu Dhabi", "Sharjah"],
    catalogName: "Dubai Tour Packages",
    touristType: ["Family", "Couple", "Adventure", "Luxury"],
  },
};

export const helicopterToursConfig: CampaignConfig = {
  slug: "helicopter-tours-india",
  theme: "sky",
  metadata: {
    title: "Helicopter Tours India - Helicopter Yatra & Adventure Tours | My Quick Trippers",
    description: "Book Helicopter Tours India with My Quick Trippers. Helicopter Yatra packages, Kedarnath helicopter tours, Vaishno Devi helicopter, Amarnath helicopter. Adventure flights, scenic tours. Best prices.",
    keywords: [
      "Helicopter Tours India",
      "Helicopter Yatra packages",
      "Kedarnath helicopter tour",
      "Vaishno Devi helicopter",
      "Amarnath helicopter tour",
      "Helicopter pilgrimage tours",
      "Char Dham helicopter packages",
      "Himalayan helicopter tours",
      "Helicopter sightseeing India",
      "Helicopter adventure tours",
      "Scenic helicopter flights",
      "Helicopter tour packages India",
      "Yatra by helicopter",
      "Helicopter pilgrimage India",
      "Best helicopter tours"
    ],
    ogTitle: "Helicopter Tours India - Helicopter Yatra & Adventure Tours",
    ogDescription: "Book Helicopter Tours India with My Quick Trippers. Helicopter Yatra packages, Kedarnath helicopter tours, Vaishno Devi helicopter, Amarnath helicopter.",
    ogImage: "/images/packages/kedarnath.jpg",
    ogImageAlt: "Helicopter Tours India - Himalayan Helicopter Flights",
  },
  heroImage: "/images/packages/helicopter-tour.jpg",
  heroImageAlt: "Helicopter Tours India - Himalayan Helicopter Flights",
  heroTitle: "Helicopter Tours India",
  heroSubtitle: "Divine Journeys from the Skies",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-white hover:bg-gray-100 text-sky-900 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Book Your Flight",
    className: "bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Helicopter Tours?",
    subtitle: "Experience pilgrimage and adventure with comfort, speed, and breathtaking aerial views",
    items: [
      { icon: "⏰", title: "Time Saving", description: "Skip hours/days of trekking with quick helicopter flights" },
      { icon: "👴", title: "Senior Friendly", description: "Accessible pilgrimage for elderly and differently-abled devotees" },
      { icon: "🏔️", title: "Scenic Views", description: "Breathtaking aerial views of Himalayan landscapes" },
      { icon: "🛡️", title: "Safe Travel", description: "Avoid difficult terrain and weather-related trekking risks" },
      { icon: "🎯", title: "Direct Access", description: "Reach remote shrines and locations not accessible by road" },
      { icon: "💎", title: "Premium Experience", description: "Comfortable and luxurious pilgrimage experience" },
    ],
  },
  destinations: {
    title: "Popular Helicopter Destinations",
    subtitle: "Sacred shrines and scenic locations accessible by helicopter",
    items: [
      { name: "Kedarnath Helicopter", description: "Sacred journey to Kedarnath Temple - skip the 16km trek", badge: "15-20 min flight", metaLine: "Altitude: 3,583m", metaLineGray: true, chips: ["Skip trekking", "Time-saving", "Scenic views"], image: "/images/packages/kedarnath-helicopter.jpg", descriptionMb: "mb-2" },
      { name: "Vaishno Devi Helicopter", description: "Quick darshan at Mata Vaishno Devi - comfortable journey", badge: "8-10 min flight", metaLine: "Altitude: 1,400m", metaLineGray: true, chips: ["Skip 13km trek", "Senior friendly", "Quick darshan"], image: "/images/packages/vaishno-devi-helicopter.jpg", descriptionMb: "mb-2" },
      { name: "Amarnath Helicopter", description: "Journey to holy Amarnath Cave - avoid difficult trek", badge: "10-15 min flight", metaLine: "Altitude: 3,888m", metaLineGray: true, chips: ["Safe pilgrimage", "Mountain views", "Time-efficient"], image: "/images/packages/amarnath-helicopter.jpg", descriptionMb: "mb-2" },
      { name: "Char Dham Helicopter", description: "Complete Char Dham Yatra by helicopter - 4-5 days", badge: "4-5 days total", metaLine: "Altitude: Various", metaLineGray: true, chips: ["Complete yatra", "Luxury travel", "Spiritual experience"], image: "/images/packages/char-dham-helicopter.jpg", descriptionMb: "mb-2" },
      { name: "Himalayan Sightseeing", description: "Scenic helicopter tours over Himalayan peaks and valleys", badge: "30-60 min flights", metaLine: "Altitude: Various", metaLineGray: true, chips: ["Panoramic views", "Photography", "Adventure"], image: "/images/packages/himalayan-helicopter.jpg", descriptionMb: "mb-2" },
      { name: "Ladakh Helicopter Tours", description: "Explore remote Ladakh monasteries and lakes by air", badge: "Custom tours", metaLine: "Altitude: 3,500m+", metaLineGray: true, chips: ["Remote access", "Scenic beauty", "Cultural tours"], image: "/images/packages/ladakh-helicopter.jpg", descriptionMb: "mb-2" },
    ],
  },
  packages: {
    filter: (pkg) =>
      pkg.title.toLowerCase().includes('helicopter') ||
      pkg.title.toLowerCase().includes('yatra') ||
      pkg.title.toLowerCase().includes('kedarnath') ||
      pkg.title.toLowerCase().includes('vaishno devi') ||
      pkg.title.toLowerCase().includes('amarnath') ||
      pkg.category === 'Helicopter' ||
      pkg.category === 'Pilgrimage',
    title: "Helicopter Tour Packages",
    subtitle: "Choose from our premium helicopter pilgrimage and adventure tours",
    emptyText: "No helicopter packages currently available. Check back soon!",
    emptyLinkText: "View All Pilgrimage Packages →",
  },
  tips: {
    title: "Essential Helicopter Tour Tips",
    subtitle: "Important guidelines for a safe and enjoyable helicopter journey",
    bullet: "✓",
    items: [
      "Book helicopter tickets well in advance, especially during peak pilgrimage seasons",
      "Check weather conditions before travel - flights are weather-dependent",
      "Carry valid ID proof and required documents for helicopter travel",
      "Arrive at helipad at least 1-2 hours before scheduled departure",
      "Pack light as there are strict weight limits for helicopter baggage",
      "Wear comfortable clothing and carry medications for high-altitude conditions",
      "Be prepared for last-minute schedule changes due to weather",
      "Choose morning flights for better weather conditions and clearer views",
    ],
  },
  faqSubtitle: "Everything you need to know about helicopter tours",
  faqs: [
    {
      question: "What are the benefits of helicopter pilgrimage tours?",
      answer: "Helicopter tours save significant time (hours/days of trekking reduced to minutes), are senior-friendly, provide safe access to remote shrines, offer breathtaking aerial views, and make pilgrimage accessible for differently-abled devotees. They're ideal for those with time constraints or physical limitations."
    },
    {
      question: "Which pilgrimage sites offer helicopter services in India?",
      answer: "Major helicopter pilgrimage services include Kedarnath (Uttarakhand), Vaishno Devi (Jammu & Kashmir), Amarnath (Jammu & Kashmir), Char Dham (Yamunotri, Gangotri, Kedarnath, Badrinath), and remote temples in Himachal Pradesh and Ladakh. Seasonal services are also available for other high-altitude shrines."
    },
    {
      question: "How much do helicopter pilgrimage tours cost?",
      answer: "Helicopter tour costs vary by destination and season. Kedarnath helicopter costs approximately ₹3,000-7,000 per person one-way, Vaishno Devi around ₹1,000-2,000, and complete Char Dham helicopter packages range from ₹1.5-3 lakhs per person. Prices are higher during peak seasons and include different service levels."
    },
    {
      question: "Are helicopter tours safe for pilgrimage?",
      answer: "Yes, helicopter tours are generally safe when operated by certified operators with experienced pilots. Services to major pilgrimage sites like Kedarnath and Vaishno Devi have good safety records. However, flights are weather-dependent and may be cancelled due to adverse conditions for passenger safety."
    },
    {
      question: "What is the booking process for helicopter pilgrimage tours?",
      answer: "Book through authorized operators or government websites (for some shrines). Provide required documents (ID proof, age certificate for senior concessions), make advance payment, and receive confirmed booking with schedule. Some shrines have online booking systems while others require manual booking through authorized agents."
    },
    {
      question: "What should I carry for helicopter pilgrimage tours?",
      answer: "Carry valid ID proof, booking confirmation, light baggage (within weight limits), comfortable clothing, medications, snacks, and water. Avoid heavy items as helicopters have strict weight restrictions. Dress in layers as temperatures vary significantly between altitudes."
    },
    {
      question: "Are helicopter tours suitable for families with children?",
      answer: "Yes, helicopter tours are family-friendly and children above 2 years usually require full tickets. However, consider altitude sickness for young children and elderly family members. Some operators have age restrictions or medical fitness requirements for high-altitude flights."
    },
    {
      question: "What happens if helicopter flights are cancelled due to weather?",
      answer: "Weather cancellations are common in mountainous regions. Most operators offer rescheduling for the next available flight or full refund if cancellation is extended. For important pilgrimages, consider keeping buffer days for weather delays or having backup trekking arrangements as contingency."
    },
  ],
  enquiry: {
    title: "Book Your Helicopter Journey",
    subtitle: "Get a customized quote for helicopter pilgrimage or adventure tours. Our experts will help you plan the perfect aerial journey.",
    destination: "Helicopter Tour",
  },
  cta: {
    title: "Take Flight to Sacred Destinations",
    text: "Book your helicopter tour today and experience divine journeys from the skies. Safe, comfortable, and time-efficient pilgrimage.",
    sectionClassName: "py-12 bg-sky-500",
    titleClassName: "text-2xl md:text-3xl font-bold text-white mb-4",
    textClassName: "text-sky-100 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-white hover:bg-gray-100 text-sky-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Helicopter Tours India - Helicopter Yatra packages, Kedarnath helicopter tours, Vaishno Devi helicopter, Amarnath helicopter",
    priceRange: "$$$",
    areaServed: ["Kedarnath", "Vaishno Devi", "Amarnath", "Char Dham", "Ladakh", "Himalayas"],
    catalogName: "Helicopter Tours India",
    touristType: ["Pilgrimage", "Adventure", "Luxury", "Senior Citizens"],
  },
};

export const himachalTourPackagesConfig: CampaignConfig = {
  slug: "himachal-tour-packages",
  theme: "green",
  metadata: {
    title: "Himachal Tour Packages - Best Shimla Manali Tours | My Quick Trippers",
    description: "Explore best Himachal Tour Packages with My Quick Trippers. Book Shimla Manali tours, Dharamshala trips, Kullu Manali honeymoon packages. Expert guidance, best prices, 24/7 support.",
    keywords: [
      "Himachal Tour Packages",
      "Shimla Manali tour packages",
      "Manali honeymoon packages",
      "Dharamshala tour packages",
      "Kullu Manali tours",
      "Himachal Pradesh tourism",
      "Hill station tours India",
      "Mountain tour packages",
      "Shimla holiday packages",
      "Manali adventure tours",
      "Spiti Valley tours",
      "Dalhousie tour packages",
      "Kasol tour packages",
      "Best Himachal tours",
      "Affordable Himachal packages"
    ],
    ogTitle: "Himachal Tour Packages - Best Shimla Manali Tours",
    ogDescription: "Explore best Himachal Tour Packages with My Quick Trippers. Book Shimla Manali tours, Dharamshala trips, Kullu Manali honeymoon packages.",
    ogImage: "/images/packages/himachal-pradesh.jpg",
    ogImageAlt: "Himachal Tour Packages - Shimla Manali Tours",
  },
  heroImage: "/images/packages/himachal-pradesh.jpg",
  heroImageAlt: "Himachal Tour Packages - Stunning Himalayan Mountains",
  heroTitle: "Himachal Tour Packages",
  heroSubtitle: "Discover the Magic of Himalayas - Shimla, Manali, Dharamshala & More",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Get Free Quote",
    className: "bg-white hover:bg-gray-100 text-green-900 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Himachal Pradesh?",
    subtitle: "Experience the perfect blend of adventure, spirituality, and natural beauty in the Himalayas",
    items: [
      { icon: "🏔️", title: "Mountain Adventures", description: "Trekking, paragliding, river rafting in Kullu Manali" },
      { icon: "🏛️", title: "Colonial Heritage", description: "British architecture in Shimla and Dalhousie" },
      { icon: "🙏", title: "Spiritual Journeys", description: "Tibetan monasteries in Dharamshala and McLeodganj" },
      { icon: "🌲", title: "Nature Escapes", description: "Pine forests, apple orchards, and scenic valleys" },
      { icon: "❄️", title: "Winter Wonderlands", description: "Snow activities in Rohtang Pass and Solang Valley" },
      { icon: "🚗", title: "Road Trips", description: "Scenic drives through Himalayan mountain roads" },
    ],
  },
  destinations: {
    title: "Popular Himachal Destinations",
    subtitle: "Explore the most sought-after hill stations and valleys",
    overlayLinks: true,
    items: [
      { name: "Shimla", description: "Queen of Hills - colonial charm and scenic beauty", image: "/images/packages/shimla.jpg" },
      { name: "Manali", description: "Adventure hub - Rohtang Pass, Solang Valley", image: "/images/packages/manali.webp" },
      { name: "Dharamshala", description: "Spiritual capital - Tibetan culture and monasteries", image: "/images/packages/dharamshala.jpg" },
      { name: "Kullu", description: "Valley of Gods - apple orchards and river rafting", image: "/images/packages/kullu.jpg" },
      { name: "Dalhousie", description: "Colonial hill station - pine forests and churches", image: "/images/packages/dalhousie.jpg" },
      { name: "Spiti Valley", description: "Cold desert - monasteries and high altitude lakes", image: "/images/packages/spiti.jpg" },
    ],
  },
  packages: {
    filter: (pkg) =>
      pkg.title.toLowerCase().includes('himachal') ||
      pkg.title.toLowerCase().includes('shimla') ||
      pkg.title.toLowerCase().includes('manali') ||
      pkg.title.toLowerCase().includes('kullu') ||
      pkg.title.toLowerCase().includes('dharamshala') ||
      pkg.title.toLowerCase().includes('dalhousie') ||
      pkg.title.toLowerCase().includes('spiti') ||
      pkg.title.toLowerCase().includes('kasol') ||
      pkg.category === 'North India',
    title: "Best Himachal Tour Packages",
    subtitle: "Curated itineraries for every traveler - families, couples, adventurers, and spiritual seekers",
    emptyText: "No Himachal packages currently available. Check back soon!",
    emptyLinkText: "View All Packages →",
  },
  faqSubtitle: "Everything you need to know about Himachal tours",
  faqs: [
    {
      question: "What is the best time to visit Himachal Pradesh?",
      answer: "The best time depends on your preferences: Summer (April-June) for pleasant weather and sightseeing, Monsoon (July-September) for lush greenery, Winter (December-March) for snow activities in Manali and Shimla."
    },
    {
      question: "How many days are ideal for a Himachal tour?",
      answer: "A typical Himachal tour ranges from 5-7 days for Shimla-Manali, 7-10 days for covering multiple destinations like Shimla-Manali-Dharamshala, and 12-15 days for comprehensive Spiti Valley tours."
    },
    {
      question: "What are the must-visit places in Himachal Pradesh?",
      answer: "Must-visit places include Shimla (Mall Road, Kufri), Manali (Rohtang Pass, Solang Valley), Dharamshala (McLeodganj, Dalai Lama Temple), Kullu Valley, Dalhousie, Khajjiar, and Spiti Valley for adventure seekers."
    },
    {
      question: "Are Himachal tour packages suitable for families?",
      answer: "Yes, Himachal tour packages are perfect for families with easy sightseeing, comfortable accommodations, kid-friendly activities, and safe transportation. We offer customized family packages with appropriate pacing."
    },
    {
      question: "What is included in Himachal tour packages?",
      answer: "Our Himachal tour packages include accommodation in hotels/resorts, transportation (private vehicle or coach), sightseeing as per itinerary, meals (breakfast and dinner as specified), and the services of experienced local guides."
    },
    {
      question: "How can I reach Himachal Pradesh?",
      answer: "Himachal is well-connected by air (Chandigarh, Kullu-Manali airports), rail (Kalka-Shimla toy train, Pathankot for Dalhousie), and road (excellent road network from Delhi, Chandigarh, and other major cities)."
    },
  ],
  enquiry: {
    title: "Plan Your Himachal Adventure",
    subtitle: "Get a customized quote for your Himachal tour package. Our experts will help you plan the perfect Himalayan getaway.",
    destination: "Himachal Pradesh",
  },
  cta: {
    title: "Ready to Explore the Himalayas?",
    text: "Book your Himachal tour package today and create memories that last a lifetime. Best prices guaranteed!",
    sectionClassName: "py-12 bg-orange-500",
    titleClassName: "text-2xl md:text-3xl font-bold text-white mb-4",
    textClassName: "text-orange-100 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-white hover:bg-gray-100 text-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Himachal Tour Packages - Shimla Manali tours, Dharamshala trips, Kullu Manali honeymoon packages",
    priceRange: "$$",
    areaServed: ["Himachal Pradesh", "Shimla", "Manali", "Dharamshala", "Kullu", "Dalhousie", "Spiti Valley"],
    catalogName: "Himachal Tour Packages",
    touristType: ["Adventure", "Family", "Honeymoon", "Spiritual"],
  },
};

export const nainitalHolidayConfig: CampaignConfig = {
  slug: "nainital-holiday",
  theme: "teal",
  metadata: {
    title: "Nainital Holiday Packages - Best Nainital Tour Packages | My Quick Trippers",
    description: "Book Nainital holiday packages with My Quick Trippers. Best Nainital tour packages, lake tours, mountain getaways. Family vacations, honeymoon trips, adventure activities. Best prices.",
    keywords: [
      "Nainital holiday packages",
      "Nainital tour packages",
      "Nainital tourism packages",
      "Nainital lake tours",
      "Nainital vacation packages",
      "Nainital weekend getaways",
      "Nainital family packages",
      "Nainital honeymoon packages",
      "Nainital adventure tours",
      "Best Nainital packages",
      "Nainital trip from Delhi",
      "Nainital holiday packages",
      "Uttarakhand hill station",
      "Lake district tours",
      "Nainital sightseeing"
    ],
    ogTitle: "Nainital Holiday Packages - Lake District Tours",
    ogDescription: "Book Nainital holiday packages with My Quick Trippers. Best Nainital tour packages, lake tours, mountain getaways.",
    ogImage: "/images/packages/nainital.jpg",
    ogImageAlt: "Nainital Holiday Packages - Beautiful Lake and Mountains",
  },
  heroImage: "/images/packages/nainital.jpg",
  heroImageAlt: "Nainital Holiday Packages - Beautiful Lake and Mountains",
  heroTitle: "Nainital Holiday Packages",
  heroSubtitle: "Escape to the Lake District of India",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-white hover:bg-gray-100 text-teal-900 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Plan Your Trip",
    className: "bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Nainital?",
    subtitle: "Experience the perfect blend of natural beauty, colonial charm, and serene lake life",
    items: [
      { icon: "🚤", title: "Lake Activities", description: "Boating, yachting, and peaceful lake experiences" },
      { icon: "🏔️", title: "Mountain Views", description: "Panoramic Himalayan vistas and scenic viewpoints" },
      { icon: "🛍️", title: "Local Shopping", description: "Handicrafts, woolens, and local delicacies" },
      { icon: "🏛️", title: "Colonial Heritage", description: "British-era architecture and churches" },
      { icon: "🥾", title: "Nature Treks", description: "Easy hiking trails and nature walks" },
      { icon: "🍽️", title: "Local Cuisine", description: "Kumaoni food and lakeside dining" },
    ],
  },
  destinations: {
    title: "Top Nainital Attractions",
    subtitle: "Must-visit landmarks and experiences in the lake district",
    items: [
      { name: "Naini Lake", description: "Heart-shaped natural lake - boating and sunset views", image: "/images/packages/naini-lake.jpg", chips: ["Boating", "Yachting", "Sunset views"], descriptionMb: "mb-3" },
      { name: "Naina Devi Temple", description: "Sacred temple on lake's northern shore - spiritual significance", image: "/images/packages/naina-devi-temple.jpg", chips: ["Temple visit", "Spiritual", "Scenic views"], descriptionMb: "mb-3" },
      { name: "Mall Road", description: "Vibrant shopping street - local handicrafts and food", image: "/images/packages/mall-road.jpg", chips: ["Shopping", "Local food", "Walking"], descriptionMb: "mb-3" },
      { name: "Snow View Point", description: "Panoramic Himalayan views - cable car access", image: "/images/packages/snow-view.jpg", chips: ["Cable car", "Mountain views", "Photography"], descriptionMb: "mb-3" },
      { name: "Eco Cave Gardens", description: "Network of interconnected caves - adventure for families", image: "/images/packages/eco-caves.jpg", chips: ["Adventure", "Family fun", "Exploration"], descriptionMb: "mb-3" },
      { name: "Tiffin Top", description: "Scenic viewpoint - perfect for picnics and photography", image: "/images/packages/tiffin-top.jpg", chips: ["Trekking", "Picnics", "Photography"], descriptionMb: "mb-3" },
    ],
  },
  packages: {
    filter: (pkg) =>
      pkg.title.toLowerCase().includes('nainital') ||
      pkg.title.toLowerCase().includes('lake') ||
      pkg.title.toLowerCase().includes('uttarakhand') ||
      pkg.category === 'North India',
    title: "Nainital Holiday Packages",
    subtitle: "Choose from our carefully curated Nainital packages - family vacations, honeymoon trips, and weekend getaways",
    emptyText: "No Nainital packages currently available. Check back soon!",
    emptyLinkText: "View All Uttarakhand Packages →",
  },
  tips: {
    title: "Essential Nainital Travel Tips",
    subtitle: "Important guidelines for a memorable lake district experience",
    bullet: "✓",
    items: [
      "Best time: March to June and September to November for pleasant weather",
      "Book boating in advance during peak season (April-June and October)",
      "Carry light woolens even in summer as evenings can be cool",
      "Try local Kumaoni cuisine at small eateries near Mall Road",
      "Visit Naina Devi Temple early morning to avoid crowds",
      "Take the cable car to Snow View Point for best Himalayan views",
      "Explore nearby lakes like Bhimtal, Naukuchiatal, and Sattal",
      "Respect the religious significance of Naina Devi Temple",
    ],
  },
  faqSubtitle: "Everything you need to know about Nainital tours",
  faqs: [
    {
      question: "What is the best time to visit Nainital?",
      answer: "The best time to visit Nainital is during summer (March-June) for pleasant weather (15-25°C) and monsoon (July-September) for lush greenery. Winter (December-February) offers snow activities and beautiful views, though temperatures can drop to 0°C."
    },
    {
      question: "How many days are ideal for a Nainital trip?",
      answer: "A typical Nainital trip requires 2-3 days to cover major attractions. For a comprehensive experience including nearby lakes (Bhimtal, Naukuchiatal, Sattal) and outdoor activities, plan for 4-5 days. Weekend trips from Delhi are very popular."
    },
    {
      question: "How do I reach Nainital from Delhi?",
      answer: "Nainital is approximately 300km from Delhi. The most convenient way is by road (6-7 hours by car). Alternatively, take a train to Kathgodam (nearest railway station, 34km away) and then a taxi or bus to Nainital. Limited bus services are also available."
    },
    {
      question: "What are the must-visit places in Nainital?",
      answer: "Must-visit places include Naini Lake (boating), Naina Devi Temple, Mall Road (shopping), Snow View Point (cable car), Eco Cave Gardens, Tiffin Top, and the Governor's House. Don't miss the sunset views from the lake and explore nearby lakes like Bhimtal and Sattal."
    },
    {
      question: "Is Nainital suitable for families with children?",
      answer: "Yes, Nainital is perfect for families with children. Activities like boating on Naini Lake, visiting Eco Cave Gardens, gentle treks to Tiffin Top, and exploring nearby lakes are kid-friendly. Many hotels offer family rooms and child-friendly amenities."
    },
    {
      question: "What is included in Nainital holiday packages?",
      answer: "Our Nainital packages include accommodation in lake-view hotels, meals (breakfast and dinner), sightseeing as per itinerary, boating on Naini Lake, local transportation, and the services of experienced guides. Premium packages include additional activities and luxury accommodations."
    },
    {
      question: "What are the accommodation options in Nainital?",
      answer: "Nainital offers a range of accommodations from budget guesthouses and heritage properties to luxury lakeside resorts. Lake-view hotels are most popular but book quickly during peak season. We recommend booking in advance, especially for weekends and holidays."
    },
    {
      question: "What activities can I do in Nainital?",
      answer: "Popular activities include boating on Naini Lake, shopping on Mall Road, visiting temples, trekking to viewpoints, cable car to Snow View Point, exploring caves, photography, and enjoying local cuisine. Adventure activities like paragliding and rock climbing are also available seasonally."
    },
  ],
  enquiry: {
    title: "Plan Your Nainital Getaway",
    subtitle: "Get a customized quote for your Nainital holiday package. Our experts will help you plan the perfect lake district vacation.",
    destination: "Nainital",
  },
  cta: {
    title: "Ready for a Lakeside Retreat?",
    text: "Book your Nainital holiday package today and experience the serenity of the lake district. Best prices guaranteed!",
    sectionClassName: "py-12 bg-teal-500",
    titleClassName: "text-2xl md:text-3xl font-bold text-white mb-4",
    textClassName: "text-teal-100 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-white hover:bg-gray-100 text-teal-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Nainital Holiday Packages - Lake tours, mountain getaways, family vacations, honeymoon trips",
    priceRange: "$$",
    areaServed: ["Nainital", "Uttarakhand", "Kumaon", "Bhimtal", "Sattal"],
    catalogName: "Nainital Holiday Packages",
    touristType: ["Family", "Couple", "Adventure", "Nature"],
  },
};

export const shimlaHoneymoonConfig: CampaignConfig = {
  slug: "shimla-honeymoon",
  theme: "pink",
  metadata: {
    title: "Shimla Honeymoon Packages - Romantic Shimla Manali Tours | My Quick Trippers",
    description: "Book Shimla honeymoon packages with My Quick Trippers. Romantic Shimla Manali tours, couple packages, honeymoon destinations. Best prices, romantic experiences, memorable trips.",
    keywords: [
      "Shimla honeymoon packages",
      "Shimla Manali honeymoon",
      "Romantic Shimla tours",
      "Honeymoon packages India",
      "Shimla couple packages",
      "Manali honeymoon packages",
      "Hill station honeymoon",
      "Romantic hill station tours",
      "Best honeymoon packages",
      "Shimla honeymoon from Delhi",
      "Himachal honeymoon tours",
      "Couple tour packages",
      "Romantic getaways India",
      "Honeymoon destinations India",
      "Shimla romantic tours"
    ],
    ogTitle: "Shimla Honeymoon Packages - Romantic Shimla Manali Tours",
    ogDescription: "Book Shimla honeymoon packages with My Quick Trippers. Romantic Shimla Manali tours, couple packages, honeymoon destinations.",
    ogImage: "/images/packages/shimla.jpg",
    ogImageAlt: "Shimla Honeymoon Packages - Romantic Mountain Getaway",
  },
  heroImage: "/images/packages/shimla-honeymoon.jpg",
  heroImageAlt: "Shimla Honeymoon Packages - Romantic Mountain Getaway",
  heroTitle: "Shimla Honeymoon Packages",
  heroSubtitle: "Romantic Beginnings in the Himalayas",
  heroPrimaryBtn: {
    text: "View Packages",
    className: "bg-white hover:bg-gray-100 text-pink-900 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  heroSecondaryBtn: {
    text: "Plan Your Honeymoon",
    className: "bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  benefits: {
    title: "Why Choose Shimla for Honeymoon?",
    subtitle: "Experience romance in the lap of Himalayas with intimate moments and breathtaking views",
    items: [
      { icon: "❤️", title: "Romantic Settings", description: "Intimate accommodations with stunning mountain views" },
      { icon: "🌅", title: "Sunset Moments", description: "Breathtaking sunset views from your room or viewpoints" },
      { icon: "🍽️", title: "Candlelight Dinners", description: "Romantic dining experiences with local cuisine" },
      { icon: "🎁", title: "Honeymoon Specials", description: "Room decorations, flowers, and couple activities" },
      { icon: "🚗", title: "Private Transfers", description: "Comfortable private transportation for couple privacy" },
      { icon: "📸", title: "Photo Opportunities", description: "Picture-perfect locations for memorable honeymoon photos" },
    ],
  },
  destinations: {
    title: "Romantic Experiences",
    subtitle: "Unforgettable moments for your perfect honeymoon",
    items: [
      { name: "Mall Road Strolls", description: "Hand-in-hand walks on Shimla's famous Mall Road at sunset", badge: "Classic Romance", image: "/images/packages/mall-road.jpg" },
      { name: "Kufri Adventures", description: "Snow activities and scenic views with your loved one", badge: "Adventure Romance", image: "/images/packages/kufri.jpg" },
      { name: "Manali Romance", description: "Solang Valley picnics and Old Manali cafe hopping", badge: "Nature Romance", image: "/images/packages/manali-romance.jpg" },
      { name: "Rohtang Pass", description: "Snow-capped peaks and romantic mountain drives", badge: "Adventure Romance", image: "/images/packages/rohtang-pass.jpg" },
      { name: "Jacobs Park", description: "Peaceful moments in Shimla's beautiful gardens", badge: "Quiet Romance", image: "/images/packages/jacobs-park.jpg" },
      { name: "Candlelight Dinners", description: "Romantic dining experiences with mountain views", badge: "Luxury Romance", image: "/images/packages/candlelight-dinner.jpg" },
    ],
  },
  packages: {
    filter: (pkg) =>
      pkg.title.toLowerCase().includes('shimla') ||
      pkg.title.toLowerCase().includes('manali') ||
      pkg.title.toLowerCase().includes('honeymoon') ||
      pkg.title.toLowerCase().includes('couple') ||
      pkg.category === 'Honeymoon' ||
      pkg.category === 'North India',
    title: "Shimla Honeymoon Packages",
    subtitle: "Choose from our romantic honeymoon packages - from cozy getaways to luxury experiences",
    emptyText: "No honeymoon packages currently available. Check back soon!",
    emptyLinkText: "View All Himachal Packages →",
  },
  tips: {
    title: "Essential Honeymoon Tips",
    subtitle: "Important guidelines for a perfect romantic getaway",
    bullet: "❤️",
    items: [
      "Best time: March-June for pleasant weather, December-February for snow romance",
      "Book honeymoon suites or cottages with mountain views for romantic ambiance",
      "Plan surprise romantic dinners or picnics at scenic locations",
      "Pack comfortable walking shoes for exploring but also dress up for romantic dinners",
      "Consider extending your trip to include both Shimla and Manali for variety",
      "Book spa treatments or couple massages for relaxation",
      "Plan your visit during weekdays to avoid crowds and enjoy more privacy",
      "Carry warm clothing even in summer as mountain evenings can be cool",
    ],
  },
  faqSubtitle: "Everything you need to know about Shimla honeymoon tours",
  faqs: [
    {
      question: "What is the best time for Shimla honeymoon?",
      answer: "The best time depends on your preference: March-June for pleasant weather (15-25°C) perfect for sightseeing, September-November for clear skies and romantic sunsets, or December-February for snow activities and cozy winter romance. Avoid monsoon (July-August) due to landslides."
    },
    {
      question: "How many days are ideal for Shimla Manali honeymoon?",
      answer: "A perfect Shimla-Manali honeymoon requires 5-7 days: 2-3 days in Shimla (Mall Road, Kufri, Jakhu Temple) and 3-4 days in Manali (Solang Valley, Rohtang Pass, Old Manali). Add 1-2 days if you want to include nearby destinations like Kullu or Kasol."
    },
    {
      question: "What are the most romantic places in Shimla and Manali?",
      answer: "Most romantic spots include Mall Road (Shimla) for sunset walks, Kufri for snow activities, Jakhu Temple for panoramic views, Solang Valley (Manali) for picnics, Old Manali for cafe hopping, Rohtang Pass for snow romance, and Hidimba Temple for spiritual moments. Don't miss candlelight dinners at mountain-view restaurants."
    },
    {
      question: "What should we pack for Shimla honeymoon?",
      answer: "Pack romantic outfits for dinners, comfortable walking shoes, warm clothing (even in summer), sunscreen, camera for memorable photos, personal medications, and any special items for romantic surprises. Layering is key as temperatures vary significantly between day and night."
    },
    {
      question: "Are Shimla honeymoon packages suitable for all budgets?",
      answer: "Yes, honeymoon packages range from budget-friendly to luxury options. Budget packages include comfortable hotels and basic sightseeing, mid-range offer better hotels and more experiences, while luxury packages feature 5-star resorts, private transfers, romantic dinners, and exclusive experiences. We customize based on your budget."
    },
    {
      question: "What are the accommodation options for honeymooners?",
      answer: "Options range from cozy honeymoon suites in hotels to private cottages, luxury resorts with mountain views, and heritage properties. We recommend booking rooms with balconies, mountain views, and honeymoon special arrangements like decorations, flowers, and romantic setups."
    },
    {
      question: "Can we customize our Shimla honeymoon itinerary?",
      answer: "Absolutely! We specialize in creating personalized honeymoon experiences. Whether you want adventure activities, quiet romantic moments, cultural experiences, or specific dining preferences, we'll customize your itinerary to match your dream honeymoon vision."
    },
    {
      question: "What romantic activities can we do in Shimla and Manali?",
      answer: "Romantic activities include sunset walks on Mall Road, candlelight dinners at mountain-view restaurants, picnics in Solang Valley, spa treatments for couples, exploring Old Manali's cafes, snow activities together, visiting scenic viewpoints like Kufri and Rohtang Pass, and enjoying peaceful moments in nature."
    },
  ],
  enquiry: {
    title: "Plan Your Dream Honeymoon",
    subtitle: "Let our experts help you create the perfect romantic getaway. Customized honeymoon packages with special arrangements for couples.",
    destination: "Shimla Honeymoon",
  },
  cta: {
    title: "Begin Your Love Story in the Mountains",
    text: "Book your Shimla honeymoon package today and create magical memories in the Himalayas. Perfect settings for your perfect beginning.",
    sectionClassName: "py-12 bg-pink-500",
    titleClassName: "text-2xl md:text-3xl font-bold text-white mb-4",
    textClassName: "text-pink-100 mb-6 max-w-2xl mx-auto",
    callButtonClassName: "bg-white hover:bg-gray-100 text-pink-600 px-6 py-3 rounded-lg font-semibold transition-colors",
  },
  jsonLd: {
    description: "Best Shimla Honeymoon Packages - Romantic Shimla Manali tours, couple packages, honeymoon destinations",
    priceRange: "$$",
    areaServed: ["Shimla", "Manali", "Kullu", "Kufri", "Himachal Pradesh"],
    catalogName: "Shimla Honeymoon Packages",
    touristType: ["Couple", "Honeymoon", "Romantic", "Luxury"],
  },
};
