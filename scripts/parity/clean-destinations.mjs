import fs from "fs";

let src = fs.readFileSync("src/data/contentData.ts", "utf8");

const junk = [
  "travel-guide__page__9",
  "franchisee",
  "saraswati-river-pushkaralu",
  "travel-guide__sri-lanka-guide",
  "book-process__index.php__q_d20c0f1649",
  "our-private-tours",
  "travel-guide__page__2",
  "travel-guide__uttar-pradesh-guide__page__2",
  "book-process__index.php__q_8bc93a0c7c",
  "book-process__index.php__q_397948f8e4",
  "travel-guide__madhya-pradesh-guide",
  "book-process__index.php__q_7efbe374b0",
  "travel-guide__page__27",
  "book-process__index.php__q_87e1ead404",
];

let removed = 0;
for (const j of junk) {
  // Match the whole multi-line object literal: { "slug": "<j>", ... },
  const escaped = j.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\{\\s*"slug": "${escaped}"[\\s\\S]*?\\},?`, "g");
  let count = 0;
  src = src.replace(re, (mm) => {
    count++;
    return "";
  });
  removed += count;
}

fs.writeFileSync("src/data/contentData.ts", src);
console.log("removed", removed, "junk destination entries");

// Verify count now
const block = src.match(/export const destinations: Destination\[\] = \[([\s\S]*?)\n\];/)?.[1] || "";
const slugs = [...block.matchAll(/"slug": "([^"]+)"/g)].map((m) => m[1]);
console.log("destinations count now:", slugs.length);
console.log("remaining:", slugs.join(", "));
