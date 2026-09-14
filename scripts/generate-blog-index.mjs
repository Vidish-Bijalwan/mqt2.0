import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const blogDataPath = path.join(root, "src", "data", "fullBlogData.json");
const imageMapPath = path.join(root, "src", "data", "blogImageMap.ts");
const outputPath = path.join(root, "src", "data", "blogIndex.generated.json");

const [fullBlogData, imageMapSource] = await Promise.all([
  readFile(blogDataPath, "utf8").then(JSON.parse),
  readFile(imageMapPath, "utf8"),
]);

const imageMapMatch = imageMapSource.match(
  /export const blogImageMap: Record<string, string> = (\{[\s\S]*?\n\});/,
);

if (!imageMapMatch) {
  throw new Error("Could not read blogImageMap from src/data/blogImageMap.ts");
}

const imageMap = JSON.parse(imageMapMatch[1]);
const fallbackImages = Object.values(imageMap);

const blogs = Object.entries(fullBlogData)
  .map(([key, data], globalIndex) => {
    const slug = key.startsWith("blog__") ? key.replace("blog__", "") : key;
    const contentText =
      data.content
        ?.filter((item) => item.type === "p")
        .map((item) => item.text)
        .join(" ") || "";
    const wordCount = contentText.split(/\s+/).filter(Boolean).length;
    const combined = `${data.title} ${contentText.slice(0, 300)}`.toLowerCase();
    let category = "Travel";

    if (/pilgrim|yatra|temple|dham|jyotirlinga|spiritual|shrine/.test(combined)) category = "Pilgrimage";
    else if (/adventure|trek|safari|rafting|camping|bungee|sport/.test(combined)) category = "Adventure";
    else if (/beach|island|sea|coastal|cruise|goa|andaman|maldives/.test(combined)) category = "Beaches";
    else if (/hill station|mountain|glacier|snowfall|valley|shimla|manali|ooty|munnar/.test(combined)) category = "Hill Stations";
    else if (/food|restaurant|coffee|tea|cuisine|street food|dish/.test(combined)) category = "Food & Cuisine";
    else if (/festival|culture|dance|art|museum|heritage|craft/.test(combined)) category = "Cultural";
    else if (/tip|guide|budget|plan|pack|travel insurance|solo/.test(combined)) category = "Travel Tips";
    else if (/hotel|resort|homestay|hostel|accommodation/.test(combined)) category = "Hotels";
    else if (/buddhis|meditation|monastery/.test(combined)) category = "Buddhist";
    else if (/honeymoon|romantic|couple/.test(combined)) category = "Honeymoon";
    else if (/wildlife|national park|tiger|bird|sanctuary/.test(combined)) category = "Wildlife";

    return {
      slug,
      title:
        data.title
          ?.replace(/ - My Quick Trippers Blog$/, "")
          .replace(/ \| My Quick Trippers$/, "") || slug.replace(/-/g, " "),
      snippet:
        `${contentText.slice(0, 160).trim()}${contentText.length > 160 ? "..." : ""}` ||
        "Discover this amazing destination...",
      image: imageMap[key] || fallbackImages[globalIndex % fallbackImages.length],
      category,
      readingTime: Math.max(1, Math.ceil(wordCount / 200)),
      wordCount,
    };
  })
  .filter((blog) => blog.wordCount > 30);

await writeFile(outputPath, `${JSON.stringify(blogs, null, 2)}\n`, "utf8");
console.log(`Generated ${blogs.length} lightweight blog records at ${outputPath}`);
