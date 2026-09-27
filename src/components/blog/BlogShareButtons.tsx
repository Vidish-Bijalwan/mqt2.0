'use client';

import { useState } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';

/**
 * Article share row: X, Facebook, WhatsApp and copy-link. Client-only so the
 * post page itself can stay a server component.
 */
export default function BlogShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const buttonClass =
    "inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition hover:border-legacy-orange hover:text-legacy-orange";

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
        <Share2 className="w-4 h-4 text-legacy-orange" />
        Share this article
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Share on X"
        >
          Share on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Share on Facebook"
        >
          Share on Facebook
        </a>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Share on WhatsApp"
        >
          Share on WhatsApp
        </a>
        <button type="button" onClick={copyLink} className={buttonClass} aria-label="Copy article link">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
