import { getPackageCommercial } from "@/data/commercial/packages";
import { evaluatePricing } from "@/lib/offers/engine";
import ValueStack from "./ValueStack";
import TierSelector from "./TierSelector";
import OfferList from "./OfferList";

interface CommercialSectionProps {
  slug: string;
  packageTitle: string;
  /** Public per-person price in rupees (existing price pipeline). */
  publicPrice: number;
  /** Formatted strikethrough price from the existing pipeline, if any. */
  crossedPrice?: string | null;
}

/**
 * Commercial upgrade for a package detail page: value stack + tiers + offers.
 *
 * Rendered ONLY for packages with a commercial config in
 * src/data/commercial/packages.ts. Adding a config for another package is
 * what generalizes the pilot — no page-code changes needed.
 */
export default function CommercialSection({
  slug,
  packageTitle,
  publicPrice,
  crossedPrice,
}: CommercialSectionProps) {
  const commercial = getPackageCommercial(slug);
  if (!commercial) return null;

  const evaluation = evaluatePricing(slug, publicPrice);
  const eligibleOffers = evaluation?.eligibleOffers ?? [];

  return (
    <div className="mt-8" data-commercial-section={slug}>
      <ValueStack
        commercial={commercial}
        publicPrice={publicPrice}
        crossedPrice={crossedPrice}
        packageSlug={slug}
      />
      <TierSelector
        tiers={commercial.tiers}
        packageSlug={slug}
        packageTitle={packageTitle}
        basePrice={publicPrice}
      />
      <OfferList evaluatedOffers={eligibleOffers} />
    </div>
  );
}
