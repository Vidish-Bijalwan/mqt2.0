// Gazetteer verification for the map pin source coordinates. Nominatim is
// queried at a respectful one-request-per-second pace; a pin passes when the
// returned place centre is within 25 km (mountain destinations may resolve to
// their nearest settlement rather than the shrine/trailhead itself).
import fs from "node:fs";

const slug = process.argv[2];
const stateName = process.argv[3];
if (!slug || !stateName) throw new Error("Usage: node scripts/verify-pin-geocoding.mjs <slug> <state name>");
const source = fs.readFileSync("src/data/destinationExplorer.ts", "utf8");
const profileStart = Math.max(source.indexOf(`${slug}: {`), source.indexOf(`"${slug}": {`));
const markerStart = source.indexOf("mapMarkers: [", profileStart);
const markerEnd = source.indexOf("],\n    places:", markerStart);
const markerBlock = markerStart >= 0 && markerEnd >= 0 ? source.slice(markerStart + "mapMarkers: [".length, markerEnd) : "";
const markers = [...markerBlock.matchAll(/\{([^{}]+)\}/g)].map((match) => {
  const read = (key) => match[1].match(new RegExp(`${key}: (?:\\"([^\\"]+)\\"|([0-9.]+))`));
  return { name: read("name")?.[1], latitude: Number(read("latitude")?.[2]), longitude: Number(read("longitude")?.[2]) };
});
const radians = Math.PI / 180;
const distanceKm = (a, b, c, d) => {
  const s = Math.sin((c - a) * radians / 2) ** 2 + Math.cos(a * radians) * Math.cos(c * radians) * Math.sin((d - b) * radians / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
};
let failed = false;
for (const marker of markers) {
  const query = new URLSearchParams({ q: `${marker.name}, ${stateName}, India`, format: "jsonv2", limit: "1" });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, { headers: { "User-Agent": "MQT-state-map-qa/1.0 (contact@myquicktrippers.com)" } });
  const result = (await response.json())[0];
  const km = result ? distanceKm(marker.latitude, marker.longitude, Number(result.lat), Number(result.lon)) : Infinity;
  const pass = Boolean(result && km <= 25);
  console.log(`${pass ? "PASS" : "REVIEW"} ${marker.name}: ${result?.display_name || "no result"}; ${Number.isFinite(km) ? `${km.toFixed(1)} km` : "unresolved"}`);
  if (!pass) failed = true;
  await new Promise((resolve) => setTimeout(resolve, 1100));
}
if (failed) process.exitCode = 1;
