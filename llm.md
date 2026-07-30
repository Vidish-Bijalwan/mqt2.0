# LLM & AI Usage Guide — My Quick Trippers

## 1. Where AI Is Appropriate

### ✅ High-Value AI Tasks

| Task | Approach | Notes |
|---|---|---|
| **Blog content generation** | GPT-4 / Gemini with destination + travel prompts | 410 posts already scraped; AI can generate new ones following the same structure |
| **SEO meta descriptions** | AI per page from title + first paragraph | Batch via script over `fullBlogData.json` and `packageDetails.json` |
| **Package overview text** | AI rewrite of scraped content to be unique | Scraped content may be duplicate — AI rewriting improves SEO |
| **Itinerary generation** | Structured prompts with destination + duration | For packages missing full itinerary detail |
| **Poster OCR correction** | AI vision model (GPT-4V/Gemini Vision) | More accurate than Tesseract for handwritten/stylised poster fonts |
| **Missing image alt text** | AI vision description of package images | Batch over `public/images/packages/` |
| **Destination guide enrichment** | AI expansion of scraped text | Only 20 destinations — expand to 50+ |
| **FAQ generation** | AI from package title + route | Most packages lack FAQs |
| **Redirect URL mapping** | AI to suggest destination URL from legacy URL pattern | Useful when expanding `redirects.json` |

### ❌ Tasks NOT Suitable for AI

| Task | Why |
|---|---|
| Editing `allPackages.ts` directly | Generated file — run the transform script instead |
| Generating `redirects.json` entries | High precision required — one wrong redirect breaks SEO |
| Writing `siteConfig.ts` values | Business-critical brand data — must be human-verified |
| Pricing data | Legal/financial sensitivity — agent must confirm all prices |
| Booking logic or payment code | Security-critical — requires human expert review |
| Making changes to `next.config.ts` | Build-critical — any error breaks all pages |

---

## 2. Prompt Templates

### Blog Post Generation
```
Write a travel blog post for My Quick Trippers (MQT India), an Indian tour agency.

Topic: [DESTINATION] - [TOPIC, e.g. "Best Places to Visit in Manali in Winter"]
Word count: 800-1200 words
Tone: Friendly, helpful, informative — like a knowledgeable travel guide
Structure:
- Engaging intro paragraph
- 4-6 H2 sections with details
- Practical tips section
- Closing paragraph with soft CTA to "enquire about [DESTINATION] tour packages"

SEO keyword: [PRIMARY KEYWORD]
Do not include pricing — just say "contact us for best rates".
Brand name: My Quick Trippers / MQT India
WhatsApp: +91-8171158569
```

### SEO Meta Description
```
Write a compelling SEO meta description (150-160 characters) for this tour page:

Package: [TITLE]
Route: [ROUTE]
Duration: [DURATION]

Requirements:
- Include the main destination name
- Mention "tour package"
- End with a soft CTA
- Stay within 160 characters
```

### Package Overview Rewrite
```
Rewrite the following tour package description in fresh, unique language for SEO purposes.
Keep all factual details (destinations, duration, inclusions) accurate.
Tone: Enthusiastic, trustworthy, slightly formal.
Length: 150-250 words.

Original:
[PASTE SCRAPED DESCRIPTION]
```

### Itinerary Day Generation
```
Generate a detailed Day [N] itinerary for a [DURATION]-day tour package.

Package: [TITLE]
Route: [ROUTE]
Day [N] should cover: [DESTINATIONS FOR THIS DAY]

Format:
Day [N]: [Short title]
Morning: ...
Afternoon: ...
Evening: ...
Overnight: [Hotel location]

Tone: Travel-guide style, practical, evocative.
```

---

## 3. AI Model Recommendations

| Use Case | Recommended Model | Why |
|---|---|---|
| Blog writing | Gemini 1.5 Pro / GPT-4o | Long context, good creative writing |
| SEO meta descriptions | Gemini Flash / GPT-4o-mini | Fast, cheap, short output |
| Poster OCR correction | Gemini Vision / GPT-4V | Better than Tesseract for stylised fonts |
| Code changes | Claude Sonnet / Gemini Pro | Best at understanding large codebases |
| Bulk batch processing | Gemini Flash (via API) | Cost-effective for high volume |

---

## 4. Batch Processing Approach

For bulk AI operations (e.g. generating meta descriptions for all 121 packages):

```python
# Recommended pattern: Python script with API batching
import json, time
from google import generativeai as genai  # or openai

data = json.load(open("myquicktrippers/src/data/packageDetails.json"))
results = {}

for slug, pkg in data.items():
    prompt = f"Write a 150-character meta description for: {pkg['title']} — {pkg.get('route', '')}"
    # ... call AI API
    results[slug] = response
    time.sleep(0.5)  # rate limiting

json.dump(results, open("meta_descriptions.json", "w"))
```

Then a separate script reads `meta_descriptions.json` and injects them into `generateMetadata()` in the package detail page.

---

## 5. Cost & Rate Limit Considerations

- **`fullBlogData.json`** has 410 posts — batch AI calls carefully. At $0.002/1K tokens and ~500 words per post, rewriting all blog posts ≈ $0.40. At GPT-4 prices it's ~$8.
- **Image alt generation** for 226 posters via vision API ≈ 226 × $0.001 = ~$0.23 (Gemini Flash Vision pricing).
- **Always test on 5-10 items before running full batch** to verify prompt quality.
- **Cache AI outputs** — write to JSON files before injecting into the app. Never call AI at runtime in the Next.js app (no API key exposure, no latency).

---

## 6. AI Coding Agent Notes

When using AI coding agents (Claude Code, Gemini, Cursor, etc.) on this repo:

1. **Always read `memory.md` first** — it contains the history of past mistakes and key decisions.
2. **Read `rules.md` before writing any code** — especially the "NOT TO DO" list.
3. **Read `architecture.md` to understand the data flow** before modifying any data pipeline file.
4. **The dev server is already running** — changes hot-reload automatically. Do not restart it unless asked.
5. **Never modify `allPackages.ts` by hand** — it is generated.
6. **Do not add new CSS without checking if a class already exists** in `globals.css`.
