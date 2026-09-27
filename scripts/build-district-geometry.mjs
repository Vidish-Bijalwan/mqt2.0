// Generates lightweight district SVG paths from the official Survey of India
// District Boundary shapefile. It intentionally never opens the sub-district file.
import fs from "node:fs";

const [stateName, slug] = process.argv.slice(2);
if (!stateName || !slug) throw new Error("Usage: node scripts/build-district-geometry.mjs <STATE_UT> <slug>");

const base = "tmp/soi-extracted-full/State_District_Subdistrict_PAN INDIA/District_Subdistrict_PAN INDIA/District Boundary";
// A handful of District DBF labels encode A, I and U as legacy glyphs. The
// raw bytes are retained by the source file; normalize only these documented
// glyphs so the emitted labels match the official district names.
const normalizeDistrictName = (value) => value.replaceAll(">", "A").replaceAll("|", "I").replaceAll("@", "U");
const stateGeometry = JSON.parse(fs.readFileSync(`src/data/geography/${slug}.json`, "utf8"));
const dbf = fs.readFileSync(`${base}.dbf`);
const fields = [];
for (let p = 32; dbf[p] !== 0x0d; p += 32) fields.push({ name: dbf.subarray(p, p + 11).toString().replace(/\0/g, ""), length: dbf[p + 16] });
const count = dbf.readUInt32LE(4), headerSize = dbf.readUInt16LE(8), recordSize = dbf.readUInt16LE(10);
const rows = [];
for (let i = 0; i < count; i++) {
  let p = headerSize + i * recordSize + 1;
  const row = { index: i };
  for (const field of fields) { row[field.name] = dbf.subarray(p, p + field.length).toString().trim(); p += field.length; }
  if (row.STATE_UT?.toLowerCase() === stateName.toLowerCase()) rows.push(row);
}
if (!rows.length) throw new Error(`No districts found for ${stateName}`);

const shp = fs.readFileSync(`${base}.shp`);
const recordOffsets = [];
for (let offset = 100, i = 0; offset < shp.length; i++) { recordOffsets.push(offset + 8); offset += 8 + shp.readUInt32BE(offset + 4) * 2; }
const { projection } = stateGeometry;
const project = ([x, y]) => [(x - projection.west) * projection.scale + projection.padding, (projection.north - y) * projection.scale + projection.padding];
function simplify(points, tolerance = 0.15) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points.at(-1)]; let maximum = 0, index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]]; const t = Math.max(0, Math.min(1, ((points[i][0] - a[0]) * dx + (points[i][1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
    const d = (points[i][0] - (a[0] + t * dx)) ** 2 + (points[i][1] - (a[1] + t * dy)) ** 2;
    if (d > maximum) { maximum = d; index = i; }
  }
  return maximum <= tolerance * tolerance ? [a, b] : [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}
function pathFor(row) {
  const offset = recordOffsets[row.index];
  const parts = shp.readInt32LE(offset + 36), points = shp.readInt32LE(offset + 40);
  const starts = Array.from({ length: parts }, (_, i) => shp.readInt32LE(offset + 44 + i * 4)); starts.push(points);
  const firstPoint = offset + 44 + parts * 4;
  const rings = starts.slice(0, -1).map((start, part) => {
    const ring = Array.from({ length: starts[part + 1] - start }, (_, i) => project([shp.readDoubleLE(firstPoint + (start + i) * 16), shp.readDoubleLE(firstPoint + (start + i) * 16 + 8)]));
    const open = ring[0][0] === ring.at(-1)[0] && ring[0][1] === ring.at(-1)[1] ? ring.slice(0, -1) : ring;
    return simplify(open);
  });
  const allPoints = rings.flat();
  const xs = allPoints.map(([x]) => x), ys = allPoints.map(([, y]) => y);
  return {
    path: rings.map((ring) => `M${ring.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join("L")}Z`).join(""),
    bounds: { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) },
  };
}
const districts = rows.map((row) => ({ name: normalizeDistrictName(row.DISTRICT), lgdCode: row.DIST_LGD, ...pathFor(row) })).sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(`src/data/geography/${slug}.districts.json`, JSON.stringify({ source: "Survey of India Administrative Boundary Database", state: stateName, tolerance: 0.15, districts }, null, 2) + "\n");
console.log(`${stateName}: ${districts.length} districts`);
console.log(districts.map((district) => district.name).join(" | "));
