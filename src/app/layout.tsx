import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import ScrollToTop from "@/components/ui/ScrollToTop";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo/mqt-india-logo.png",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Lightweight event tracker (T28): pushes any [data-track] click to the
            dataLayer (works with GTM/GA4 when installed; no-op otherwise).
            Kept in <head> (with the JSON-LD) so React never treats it as a
            client-rendered body script. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('[data-track]'):null;if(!t)return;var d={event:t.getAttribute('data-track'),href:t.getAttribute('href')||''};window.dataLayer=window.dataLayer||[];window.dataLayer.push(d);});`,
          }}
        />
      </head>
      <body className={roboto.className} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
          <FloatingButtons />
          <FloatingWhatsApp />
          <ScrollToTop />
        </div>
      </body>
    </html>
  );
}
