// Fails a state if an on-map destination pin does not land inside the official
// state and district paths. Pin locations stay WGS84; label placement is never
// used to hide or correct a coordinate error.
import fs from "node:fs";

const slug = process.argv[2];
if (!slug) throw new Error("Usage: node scripts/verify-map-pins.mjs <state-slug>");

const source = fs.readFileSync("src/data/destinationExplorer.ts", "utf8");
const profileStart = Math.max(source.indexOf(`${slug}: {`), source.indexOf(`"${slug}": {`));
const markerStart = source.indexOf("mapMarkers: [", profileStart);
const markerEnd = source.indexOf("],\n    places:", markerStart);
const markerBlock = markerStart >= 0 && markerEnd >= 0 ? source.slice(markerStart + "mapMarkers: [".length, markerEnd) : "";
if (!markerBlock) throw new Error(`No map markers found for ${slug}`);
const markers = [...markerBlock.matchAll(/\{([^{}]+)\}/g)].map((match) => {
  const read = (key) => match[1].match(new RegExp(`${key}: (?:\\"([^\\"]+)\\"|([0-9.]+))`));
  return { name: read("name")?.[1], latitude: Number(read("latitude")?.[2]), longitude: Number(read("longitude")?.[2]) };
});

const geometry = JSON.parse(fs.readFileSync(`src/data/geography/${slug}.json`, "utf8"));
const { districts } = JSON.parse(fs.readFileSync(`src/data/geography/${slug}.districts.json`, "utf8"));
const project = (latitude, longitude) => {
  const p = geometry.projection, radians = Math.PI / 180, a = 6378137;
  const e = Math.sqrt(2 / 298.257223563 - (1 / 298.257223563) ** 2);
  const m = (phi) => Math.cos(phi) / Math.sqrt(1 - (e * Math.sin(phi)) ** 2);
  const t = (phi) => Math.tan(Math.PI / 4 - phi / 2) / ((1 - e * Math.sin(phi)) / (1 + e * Math.sin(phi))) ** (e / 2);
  const phi1 = p.standardParallel1 * radians, phi2 = p.standardParallel2 * radians;
  const n = Math.log(m(phi1) / m(phi2)) / Math.log(t(phi1) / t(phi2));
  const f = m(phi1) / (n * t(phi1) ** n), rho = a * f * t(latitude * radians) ** n, rho0 = a * f * t(p.latitudeOfOrigin * radians) ** n;
  const theta = n * (longitude - p.centralMeridian) * radians;
  const x = p.falseEasting + rho * Math.sin(theta), y = p.falseNorthing + rho0 - rho * Math.cos(theta);
  return { x: (x - p.west) * p.scale + p.padding, y: (p.north - y) * p.scale + p.padding };
};
const rings = (path) => [...path.matchAll(/M([^Z]+)Z/g)].map((match) => {
  const numbers = (match[1].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  return Array.from({ length: numbers.length / 2 }, (_, index) => [numbers[index * 2], numbers[index * 2 + 1]]);
});
const inRing = (point, ring) => ring.reduce((inside, [x1, y1], index) => {
  const [x2, y2] = ring[(index + 1) % ring.length];
  return ((y1 > point.y) !== (y2 > point.y)) && point.x < ((x2 - x1) * (point.y - y1)) / (y2 - y1) + x1 ? !inside : inside;
}, false);
const inPath = (point, path) => rings(path).reduce((inside, ring) => inRing(point, ring) ? !inside : inside, false);
const pointToSegment = (point, [x1, y1], [x2, y2]) => {
  const dx = x2 - x1, dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((point.x - x1) * dx + (point.y - y1) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(point.x - (x1 + t * dx), point.y - (y1 + t * dy));
};
const edgeDistance = (point, path) => Math.min(...rings(path).flatMap((ring) => ring.map((vertex, index) => pointToSegment(point, vertex, ring[(index + 1) % ring.length]))));

let failed = false;
for (const marker of markers) {
  const point = project(marker.latitude, marker.longitude);
  const district = districts.find((candidate) => inPath(point, candidate.path));
  const insideState = inPath(point, geometry.boundaryPath);
  const edge = edgeDistance(point, geometry.boundaryPath);
  // Under 2 projected pixels is treated as a boundary failure rather than a
  // visually hand-tuned pass. Review the source coordinate instead.
  const pass = Boolean(district && insideState && edge >= 2);
  console.log(`${pass ? "PASS" : "FAIL"} ${marker.name}: ${district?.name || "no district"}; state edge ${edge.toFixed(2)}px`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
