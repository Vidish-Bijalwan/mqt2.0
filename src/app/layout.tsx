import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ClientRuntime from "@/components/layout/ClientRuntime";
import "../lib/env";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-manrope", 
  display: "swap",
  preload: true
});
const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  variable: "--font-bricolage", 
  display: "swap",
  preload: true
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: siteConfig.domain,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Curated Travel Experiences`,
    description: siteConfig.description,
    url: siteConfig.domain,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Curated Travel Experiences`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.domain}/#organization`,
        "name": siteConfig.name,
        "url": siteConfig.domain,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteConfig.domain}/logo/mqt-india-logo.png`
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": siteConfig.phone,
          "contactType": "customer service"
        }
      },
      {
        "@type": "TravelAgency",
        "@id": `${siteConfig.domain}/#localbusiness`,
        "name": siteConfig.name,
        "url": siteConfig.domain,
        "image": `${siteConfig.domain}/logo/mqt-india-logo.png`,
        "telephone": siteConfig.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": siteConfig.address.street,
          "addressLocality": siteConfig.address.city,
          "addressRegion": siteConfig.address.state,
          "postalCode": siteConfig.address.pin,
          "addressCountry": siteConfig.address.country
        },
        "priceRange": "$$"
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.domain}/#website`,
        "url": siteConfig.domain,
        "name": siteConfig.name,
        "description": siteConfig.description,
        "publisher": {
          "@id": `${siteConfig.domain}/#organization`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What types of tour packages does My Quick Trippers offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "My Quick Trippers offers a wide range of tour packages including India tour packages, Himachal Tour Packages, Dubai Tour Packages, Chardham Yatra, Nainital holiday packages, Buddhist Tours India, Helicopter Tours India, Shimla honeymoon packages, and Dehradun adventure tours. We also offer international tour packages to destinations like Bali, Nepal, and more."
            }
          },
          {
            "@type": "Question",
            "name": "How do I book a tour package with My Quick Trippers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can book tour packages through our website by browsing our packages, selecting your preferred destination and dates, and filling out the enquiry form. Our team will contact you to finalize the booking. You can also contact us directly via phone or WhatsApp for assistance."
            }
          },
          {
            "@type": "Question",
            "name": "What is included in My Quick Trippers tour packages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our tour packages typically include accommodation, transportation, sightseeing, meals as specified in the itinerary, and the services of experienced tour guides. Specific inclusions vary by package, so please check the detailed itinerary for each tour."
            }
          },
          {
            "@type": "Question",
            "name": "Does My Quick Trippers offer customized tour packages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, My Quick Trippers offers customized tour packages tailored to your preferences, budget, and travel dates. Contact us with your requirements and our team will create a personalized itinerary for you."
            }
          },
          {
            "@type": "Question",
            "name": "What payment options are available for booking tours?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We accept various payment methods including online payments through our secure payment gateway, bank transfers, and other convenient options. Payment terms and advance booking requirements vary by package."
            }
          },
          {
            "@type": "Question",
            "name": "What is the cancellation policy for My Quick Trippers packages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cancellation policies vary depending on the package and timing of cancellation. Specific terms are outlined in our terms and conditions. We recommend reviewing the cancellation policy at the time of booking or contacting our team for clarification."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="prefetch" href="/packages" />
        <link rel="prefetch" href="/blog" />
        <link rel="prefetch" href="/contact-us" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${manrope.variable} ${bricolage.variable}`} suppressHydrationWarning>
        <ClientRuntime />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="site-shell flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" className="flex-grow"><ErrorBoundary>{children}</ErrorBoundary></main>
          <Footer />
          <FloatingButtons />
          <FloatingWhatsApp />
          <ScrollToTop />
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
