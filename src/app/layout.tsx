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
import { safeJsonLd } from "@/utils/jsonLd";
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
    // ?v=2 cache-bust: the previous favicon.ico was the Vercel triangle and
    // browsers cache favicons aggressively — the query string forces a refetch.
    icon: [
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/images/mqt-logo-256.webp', sizes: '256x256', type: 'image/webp' },
      { url: '/favicon.ico?v=2', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png?v=2',
  },
  // No site-wide canonical here: a root `alternates.canonical` made every
  // page (e.g. /special-tours) canonicalize to the homepage. Each route sets
  // its own self-canonical instead. OG/Twitter stay as generic fallbacks.
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Curated Travel Experiences`,
    description: siteConfig.description,
    url: siteConfig.domain,
    images: [
      {
        url: `${siteConfig.domain}/images/og-default.svg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Curated Travel Experiences`,
    description: siteConfig.description,
    images: [`${siteConfig.domain}/images/og-default.svg`],
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
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="prefetch" href="/packages" />
        <link rel="prefetch" href="/blog" />
        <link rel="prefetch" href="/contact-us" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
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
          {/* First-party cookieless pageview beacon (src/lib/analyticsDb.ts).
              Inline on purpose: no extra request, fires once per page load,
              respects Do-Not-Track, skips /admin/*, bots filtered server-side. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{if(navigator.doNotTrack==="1"||window.doNotTrack==="1")return;var p=location.pathname;if(p==="/admin"||p.indexOf("/admin/")===0)return;var q=new URLSearchParams(location.search);var d={path:p.slice(0,500),referrer:document.referrer||"",utm_source:q.get("utm_source")||"",utm_medium:q.get("utm_medium")||"",utm_campaign:q.get("utm_campaign")||""};var b=new Blob([JSON.stringify(d)],{type:"application/json"});if(navigator.sendBeacon){navigator.sendBeacon("/api/analytics/track",b)}else{fetch("/api/analytics/track",{method:"POST",body:JSON.stringify(d),headers:{"content-type":"application/json"},keepalive:true})}}catch(e){}})();`,
            }}
          />
        </div>
      </body>
    </html>
  );
}
