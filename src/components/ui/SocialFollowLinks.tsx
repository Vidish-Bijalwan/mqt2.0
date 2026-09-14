import { siteConfig } from "@/data/siteConfig";

const socialLinks = [
  { label: "Facebook", href: siteConfig.social.facebook, mark: "f" },
  { label: "Instagram", href: siteConfig.social.instagram, mark: "◎" },
  { label: "YouTube", href: siteConfig.social.youtube, mark: "▶" },
  { label: "LinkedIn", href: siteConfig.social.linkedin, mark: "in" },
  { label: "X", href: siteConfig.social.twitter, mark: "X" },
] as const;

export default function SocialFollowLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2.5" aria-label="My Quick Trippers social media">
      {socialLinks.map(({ label, href, mark }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow My Quick Trippers on ${label}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#cfded9] bg-white px-4 text-sm font-bold text-[#173f38] shadow-sm transition-colors hover:border-[#e96822] hover:text-[#c95316]"
        >
          <span aria-hidden="true" className="min-w-4 text-center text-sm font-black">{mark}</span>
          {!compact && label}
        </a>
      ))}
    </div>
  );
}
