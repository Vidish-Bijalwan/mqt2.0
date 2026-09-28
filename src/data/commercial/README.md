# Commercial config — operator guide

This folder is the single source of truth for package pricing UI:
value stacks, Good/Better/Best tiers, and offers. Edit data here —
never in components.

## Files

- `defaults.ts` — business-wide guardrails (target/minimum margin, payment
  cost %, reserves). One place; components never hardcode these.
- `packages.ts` — per-package configs. A package gets the commercial UI
  (value stack + tiers + offers) on its detail page **only** when it has an
  entry here. This is how the pilot generalizes: add a config, get the UI.

## Honesty rules (enforced by the engine + components)

1. **Savings are computed, never written.** The "bundle advantage" row
   appears only when every `componentValues[].value` is a real number and
   the total exceeds the public price. Leave `componentValues: null` until
   you have real contracted rates.
2. **Every value figure needs a basis.** `comparisonBasis` (bonuses) and
   `basis` (components) tell the customer where the number comes from.
3. **Badges:** neutral labels ("Popular configuration", "Comfort upgrade")
   are always fine. Popularity claims ("Most Chosen") require
   `badgeVerified: true` backed by real booking data.
4. **Tiers:** `verified: true` only when differences + price match real,
   bookable inventory. Unverified tiers show "Price on enquiry".
5. **EARLY_BIRD** requires a real `expiresAt` (future) + `inventorySource`,
   otherwise the engine hides it.
6. **GROUP_UNLOCK** shows the unlock *rule* (e.g. "Groups of 6+ unlock
   ₹750/person"). Never show a live "N more travellers" counter — there is
   no live booking feed.
7. **Margin floor:** any offer that would push contribution below
   `minimumMarginPct` is rejected by the engine and never displayed.
8. Cost fields (`supplierCost`, reserves) are operator-confidential and are
   never sent to the browser in rendered output.
9. **Strikethrough prices need a real, labeled basis.** The legacy
   `priceOverrides.json` `mrp` renders as an unlabeled strikethrough + "Save"
   badge. Until a package has a real comparison basis (a genuine previous or
   list price you can label), set `mrp` equal to `dealPrice` so no
   strikethrough renders. Never invent an MRP to imply a discount.

## Turning on a tier price / offer

```ts
// In packages.ts, for your package:
tiers: [
  { id: "comfort", priceFrom: 38500, verified: true, /* ... */ },
],
offers: [
  {
    id: "diwali-2026-group",
    type: "GROUP_UNLOCK",
    packageId: "<slug>",
    headline: "Travel with friends, everyone saves",
    detail: "Book 6 or more travellers on the same departure.",
    offerAmount: 750,          // ₹/person — must keep margin above floor
    threshold: 6,
    active: true,
  },
],
```

After editing, the detail page picks it up on the next ISR refresh
(`revalidate = 86400`) — no code deploy needed for data-only changes
(though a deploy is still required to ship the edited file).
