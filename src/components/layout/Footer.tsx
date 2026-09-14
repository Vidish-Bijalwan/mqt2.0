import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { footerLinks } from "@/data/footerLinks";

export default function Footer() {
  return (
    <footer className="premium-footer text-white">
      <div className="mx-auto w-[92%] max-w-[1440px]">
        <section className="premium-footer-cta">
          <div>
            <span className="premium-footer-kicker">Plan with a travel expert</span>
            <h2>Let&apos;s shape a journey worth remembering.</h2>
            <p>Tell us where you want to go. We&apos;ll help with the route, stays and the details in between.</p>
          </div>
          <div className="premium-footer-actions">
            <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" /> Chat on WhatsApp
            </a>
            <a href={`tel:${siteConfig.phoneRaw}`}><Phone aria-hidden="true" /> Call a travel expert</a>
          </div>
        </section>

        <div className="premium-footer-grid">
          <div className="premium-footer-brand">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/images/mqt-logo-256.webp" alt="My Quick Trippers" width={58} height={58} className="rounded-full border border-white/20" />
              <span><strong>My Quick Trippers</strong><small>Your journey, our expertise</small></span>
            </Link>
            <p>{siteConfig.description}</p>
            <div className="premium-footer-trust"><ShieldCheck aria-hidden="true" /><span>Government approved<br />ISO 9001 certified</span></div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3>{title}</h3>
              <ul>
                {links.slice(0, 6).map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.name}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="premium-footer-contact">
          <div><Phone aria-hidden="true" /><span>Talk to us</span><a href={`tel:${siteConfig.phoneRaw}`}>{siteConfig.phone}</a></div>
          <div><Mail aria-hidden="true" /><span>Email our team</span><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
          <Link href="/contact-us"><span>New Delhi · Dehradun · India</span><strong>View all offices</strong><ArrowUpRight aria-hidden="true" /></Link>
        </div>

        <div className="premium-footer-bottom">
          <p>© 2009–{new Date().getFullYear()} {siteConfig.name} Pvt. Ltd.</p>
          <div>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/site-map">Sitemap</Link>
          </div>
          <p>Recognized by the Ministry of Tourism, Government of India</p>
        </div>
      </div>
    </footer>
  );
}
