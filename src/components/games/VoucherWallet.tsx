"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Copy,
  Gift,
  Ticket,
  Wallet,
} from "lucide-react";
import {
  activeVouchers,
  getWalletServerSnapshot,
  getWalletSnapshot,
  subscribeWallet,
  walletTotalValue,
  type StoredVoucher,
} from "@/lib/games/voucherWallet";
import { formatRupees } from "@/lib/games/gameEngine";
import { siteConfig } from "@/data/siteConfig";

function VoucherCard({ voucher }: { voucher: StoredVoucher }) {
  const [copied, setCopied] = useState(false);
  const expiryLabel = new Date(voucher.expiresAtIso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — code stays visible to copy manually */
    }
  }, [voucher.code]);

  const whatsappHref = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi MyQuickTrippers! I won a ${voucher.label} on Spin the Himalayas. My voucher code is ${voucher.code}. I'd like to use it on a booking.`,
  )}`;

  return (
    <li className="relative overflow-hidden rounded-3xl border-2 border-brand-cta/60 bg-surface-card shadow-[var(--shadow-card)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-cta via-brand-secondary to-brand-cta"
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-cta-deep">
              <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
              Voucher won
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">
              {formatRupees(voucher.value)}
            </p>
          </div>
          <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-[11px] font-bold text-brand-primary">
            {voucher.label}
          </span>
        </div>

        <button
          type="button"
          onClick={copyCode}
          aria-label={`Copy voucher code ${voucher.code}`}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-brand-secondary/60 bg-brand-secondary/5 px-4 py-2.5 transition-colors hover:bg-brand-secondary/10"
        >
          <code className="font-mono text-xl font-bold tracking-widest text-brand-primary">
            {voucher.code}
          </code>
          {copied ? (
            <span className="flex items-center gap-1 text-sm font-bold text-state-success">
              <Check className="h-4 w-4" aria-hidden="true" /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm font-bold text-brand-secondary">
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy
            </span>
          )}
        </button>

        <dl className="mt-3 space-y-1 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Min. booking</dt>
            <dd className="font-bold text-ink">{formatRupees(voucher.minSpend)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Valid until</dt>
            <dd className="font-bold text-ink">{expiryLabel}</dd>
          </div>
        </dl>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 font-display text-base font-bold text-white transition-transform active:scale-[0.98]"
        >
          <BadgeCheck className="h-5 w-5" aria-hidden="true" />
          Redeem on WhatsApp
        </a>
      </div>
    </li>
  );
}

export default function VoucherWallet() {
  // Live view of this device's wallet (useSyncExternalStore: no cascading
  // setState-in-effect, referentially stable snapshots, SSR-safe).
  const wallet = useSyncExternalStore(
    subscribeWallet,
    getWalletSnapshot,
    getWalletServerSnapshot,
  );

  const active = activeVouchers(wallet, new Date().toISOString());
  const total = walletTotalValue(wallet);

  return (
    <section aria-label="Your voucher wallet" className="mx-auto w-full max-w-6xl px-4">
      <div className="rounded-3xl border border-line bg-surface-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
            <Wallet className="h-6 w-6 text-brand-secondary" aria-hidden="true" />
            Your voucher wallet
          </h2>
          {active.length > 0 && (
            <p className="rounded-full bg-brand-cta/15 px-4 py-1.5 text-sm font-extrabold text-ink">
              {formatRupees(total)} in vouchers
            </p>
          )}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Every voucher you win on this device is saved here automatically — no
          account needed. Copy a code and mention it on WhatsApp when you book.
        </p>

        {active.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed border-line bg-surface-canvas/60 px-6 py-10 text-center">
            <Gift className="h-10 w-10 text-brand-secondary" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-extrabold text-ink">
              No vouchers yet
            </p>
            <p className="mt-1 max-w-md text-sm text-ink-muted">
              Spin the wheel above — every winning spin lands here as a real,
              redeemable voucher.
            </p>
            <Link
              href="#play"
              className="mt-4 rounded-2xl bg-brand-cta px-6 py-3 font-display text-base font-extrabold text-[#0B1F33] transition-transform active:scale-[0.98]"
            >
              Spin now
            </Link>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((v) => (
              <VoucherCard key={v.code} voucher={v} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
