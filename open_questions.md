# Open Questions — MQT Audit

## Pricing (Part B)

### OQ-01: Should placeholder prices (₹31,125 mrp / ₹24,900 deal) be multiplied or removed?
8 packages share identical ₹31,125/₹24,900 values. These are clearly scraper defaults, not real prices. Options:
- **A)** Remove them (set to empty) so those 8 show "Pricing on request" like the other 942
- **B)** Multiply them (1.5x would give ₹46,687/₹37,350) — but this makes fake prices look real
- **C)** Flag them for the business to provide real prices

### OQ-02: The `getPriceInfo()` fallback flags ₹2 and ₹24750 as "fake" — should these be overridden?
Currently `dealValue === 2 || mrpValue === 2 || dealValue === 24750` triggers "no price" mode. If we multiply by 1.5x, ₹2 becomes ₹3 and ₹24750 becomes ₹37,125 — neither hits the flag. This means multiplying could accidentally surface prices that were deliberately hidden.

### OQ-03: JSON-LD price uses fallback "15000" for packages without prices
The SEO structured data defaults to `"price": "15000"` for packages without a real price. This is misleading for Google. Should we:
- **A)** Use the multiplied dealPrice when available, omit price otherwise
- **B)** Remove the offers block entirely when no real price exists

## Redesign (Part C)

### OQ-04: The "diagonal two-photo collage" layout — how many packages actually have 2+ images?
`image2` field exists on some packages. Need to check the count before committing to this layout.

### OQ-05: Should the FAQ tab be visible even when there are only auto-generated FAQs?
All 1014 packages now have 5 auto-generated FAQ entries. Some may be generic. Should we:
- **A)** Show the FAQ tab for all (current behavior, just need to wire the rendering)
- **B)** Only show when FAQ content is substantive (requires quality threshold)

### OQ-06: The `nit-pcard-price` area shows "Pricing on request" in orange — reference uses "Contact for Price" in a different style. Which to match?
- Current: orange text, no background
- Reference: gray text on light background with a green "Send Enquiry" button
