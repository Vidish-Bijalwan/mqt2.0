# GEO / AEO Strategy (adapted)

**Source:** `~/workspace/mqt-seo-research/02-ai-search-geo.md` (~40 cited sources,
evidence-labeled ✅/🟡/🔴) · **Date:** 2026-09-28

**Goal:** earn citations/recommendations in ChatGPT, Gemini, Perplexity, Copilot,
Claude for travel queries — and through that, leads. **Nobody can guarantee
citations.** Answers are stochastic; there is no Search Console for AI engines.
Never promise or buy "guaranteed citations."

## What actually moves the needle (evidence-weighted)

1. **Earned brand mentions** (~3× the AI-visibility correlation of backlinks) —
   press, listicles, creator blogs, directories.
2. **Genuine reviews** on Google/Tripadvisor — travel is a reviews game (reviews +
   UGC = 54.1% of ChatGPT travel citations). Only real reviews; the fabricated
   on-site corpus is being removed (see master audit P0-1).
3. **YouTube presence** (strongest single correlate, 0.737) — transcripts/titles/
   descriptions carry training weight.
4. **Bing indexation** — ChatGPT citations match Bing results ~87%. Verify **Bing
   Webmaster Tools** + IndexNow; never block `OAI-SearchBot`; keep pages
   server-rendered.
5. **Fact-dense, quotable content** — statistics, direct quotations, cited sources
   (the only peer-reviewed tactic; lab ceiling ~+40%, expect single-digit to
   moderate real-world lifts). Keyword stuffing *hurt* (~-8–10%).
6. **Pre-trip transactional queries are the winnable half** — operator-owned pages
   dominate cited answers there (55.74%); engines favor the brand's own package
   page as the attributable spec source. Clear pricing, inclusions/exclusions,
   itinerary tables.

## What doesn't (do not spend here)

- **llms.txt** — ~97% never fetched; zero measured citation effect. Ship as P3
  insurance only, never as a strategy line-item.
- **Extra schema as a citation lever** — controlled test found no causal lift.
  Schema is hygiene/anti-garbling (consistent entity facts everywhere), not a lever.
- **Markdown page twins** — refuted; crawlers skip `.md`.
- **Prompt injection / fake reviews / "submit to ChatGPT" services** — off-limits
  (some carry legal liability).

## Developer actions (ranked)

1. Bing Webmaster Tools verification + IndexNow; explicit allow for retrieval
   crawlers (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`) in
   robots.txt — wildcard already covers them; explicit is documentation.
2. Entity consistency: name/address/phone/WhatsApp **identical** everywhere
   (ChatGPT/Perplexity get basic business facts right only ~68% of the time).
3. Answer-first content blocks on top commercial pages: direct-answer lead,
   question-based H2s, tables, real statistics with sources, first-hand signals.
   Destination H2 depth (Best time / How to reach / Things to do / Where to stay / FAQ).
4. Keep structured data truthful and visible-text-matched (anti-garbling);
   `TouristTrip` typing on packages, `ItemList` on hubs, `dateModified` current.
5. `/llms.txt`: genuinely useful curated map of the site (P3).
6. Fixed prompt set per engine ("best kedarnath tour operators", "chardham
   package from delhi cost", …), checked weekly — directional only.

## Off-page (ops, compounds over months)

- Claim Tripadvisor listing; respond to every review by name; real trip photos.
- Earned inclusion in "best travel agency in \<city\>" listicles (outreach, expert
   quotes/data — never paid placement disguised as editorial).
- One data-driven digital-PR asset per quarter (e.g. "what travellers actually
   paid for a Kashmir trip" — a real price index from genuine bookings).

## Defensive note

AI Overviews cut CTR for top pages (~-58% in one study), but pages *cited inside*
AIOs get ~35% more organic clicks than uncited peers. Being uncited in a
zero-click world is worse than being cited in one.
