import Link from "next/link";
import Image from "next/image";
import StateMotif from "./StateMotif";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";
import type { StateMotifKey, StateSignature } from "@/data/stateArtwork";

/**
 * ONE renderer for every state's signature block. It switches on
 * signature.layout ("route" | "grid") — all variation comes from data
 * (title, stops, motif, accent vars), never from per-state components.
 */
export default function StateSignatureModule({
  signature,
  motif,
}: {
  signature: StateSignature;
  motif?: StateMotifKey;
}) {
  return (
    <section
      aria-label={signature.title}
      className="relative overflow-hidden border-y border-[#dce5df] bg-white"
    >
      {motif && (
        <StateMotif
          motif={motif}
          className="absolute inset-0 h-full w-full text-[color-mix(in_srgb,var(--state-accent)_14%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-xs font-black uppercase tracking-[.22em] text-[var(--state-accent-deep)]">
          {signature.eyebrow}
        </p>
        <h2 className="font-display mt-2 max-w-2xl text-3xl font-bold tracking-[-.04em] text-[#143a35] sm:text-4xl">
          {signature.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#61766f] sm:text-base">
          {signature.description}
        </p>
        {signature.layout === "grid" ? (
          <GridStops signature={signature} />
        ) : (
          <RouteStops signature={signature} />
        )}
      </div>
    </section>
  );
}

function RouteStops({ signature }: { signature: StateSignature }) {
  return (
    <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {signature.stops.map((stop, i) => (
        <li
          key={stop.name}
          className="overflow-hidden rounded-2xl border border-[#e2eae5] bg-[#fbfdfb]"
        >
          <div className="h-1 bg-[var(--state-accent)]" />
          <div className="p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--state-accent)] text-sm font-black text-[var(--state-accent-ink)]">
              {i + 1}
            </span>
            <h3 className="font-display mt-3 text-xl font-bold text-[#143a35]">{stop.name}</h3>
            <p className="mt-1 text-sm leading-5 text-[#61766f]">{stop.note}</p>
            {stop.href && (
              <Link
                href={stop.href}
                className="mt-3 inline-block text-sm font-bold text-[var(--state-accent-deep)] hover:underline"
              >
                Find journeys →
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function GridStops({ signature }: { signature: StateSignature }) {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {signature.stops.map((stop) => (
        <article
          key={stop.name}
          className="group overflow-hidden rounded-2xl border border-[#e2eae5] bg-white shadow-[0_10px_30px_rgba(11,31,51,.06)]"
        >
          {stop.image ? (
            <div className="relative aspect-[16/10] overflow-hidden bg-[#0b1f33]">
              <Image
                src={stop.image}
                alt={stop.name}
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                placeholder={IMAGE_SKELETON}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--state-accent)]" />
            </div>
          ) : (
            <div className="h-1 bg-[var(--state-accent)]" />
          )}
          <div className="p-5">
            <h3 className="font-display text-xl font-bold text-[#143a35]">{stop.name}</h3>
            <p className="mt-1 text-sm leading-5 text-[#61766f]">{stop.note}</p>
            {stop.href && (
              <Link
                href={stop.href}
                className="mt-3 inline-block text-sm font-bold text-[var(--state-accent-deep)] hover:underline"
              >
                Find journeys →
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
