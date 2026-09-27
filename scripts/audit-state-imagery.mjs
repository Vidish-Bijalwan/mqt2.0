// Reports the approved-library capacity for the 36-state illustrated-map
// rollout. It intentionally excludes new_images and treats every district as
// needing one unique final tile.
import fs from "node:fs";
import path from "node:path";

const states = [
  ["uttarakhand", "UTTARAKHAND"], ["himachal-pradesh", "HIMACHAL PRADESH"], ["uttar-pradesh", "UTTAR PRADESH"], ["rajasthan", "RAJASTHAN"], ["kerala", "KERALA"], ["goa", "GOA"], ["maharashtra", "MAHARASHTRA"], ["karnataka", "KARNATAKA"], ["tamil-nadu", "TAMIL NADU"], ["west-bengal", "WEST BENGAL"], ["gujarat", "GUJARAT"], ["punjab", "PUNJAB"], ["haryana", "HARYANA"], ["madhya-pradesh", "MADHYA PRADESH"], ["bihar", "BIHAR"], ["jharkhand", "JHARKHAND"], ["chhattisgarh", "CHHATTISGARH"], ["odisha", "ODISHA"], ["assam", "ASSAM"], ["sikkim", "SIKKIM"], ["arunachal-pradesh", "ARUNACHAL PRADESH"], ["meghalaya", "MEGHALAYA"], ["mizoram", "MIZORAM"], ["manipur", "MANIPUR"], ["nagaland", "NAGALAND"], ["tripura", "TRIPURA"], ["andhra-pradesh", "ANDHRA PRADESH"], ["telangana", "TELANGANA"], ["delhi", "DELHI"], ["jammu-and-kashmir", "JAMMU AND KASHMIR"], ["ladakh", "LADAKH"], ["chandigarh", "CHANDIGARH"], ["puducherry", "PUDUCHERRY"], ["andaman-and-nicobar", "ANDAMAN AND NICOBAR ISLANDS"], ["lakshadweep", "LAKSHADWEEP"], ["dadra-nagar-haveli-daman-diu", "DADRA & NAGAR HAVELI & DAMAN & DIU"],
];
const dbf = fs.readFileSync("tmp/soi-extracted-full/State_District_Subdistrict_PAN INDIA/District_Subdistrict_PAN INDIA/District Boundary.dbf");
const fields = [];
for (let p = 32; dbf[p] !== 0x0d; p += 32) fields.push({ name: dbf.subarray(p, p + 11).toString().replace(/\0/g, ""), length: dbf[p + 16] });
const recordCount = dbf.readUInt32LE(4), headerSize = dbf.readUInt16LE(8), recordSize = dbf.readUInt16LE(10);
const districtsByState = new Map();
for (let i = 0; i < recordCount; i++) {
  let p = headerSize + i * recordSize + 1, state = "";
  for (const field of fields) { const value = dbf.subarray(p, p + field.length).toString().trim(); if (field.name === "STATE_UT") state = value; p += field.length; }
  districtsByState.set(state, (districtsByState.get(state) || 0) + 1);
}
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) walk(full); else if (entry.name.endsWith("-lg.webp")) files.push(full.replaceAll("\\", "/")); } }
walk("public/images/location-library");
const rows = states.map(([slug, officialName]) => {
  const usable = files.filter((file) => file.includes(`-${slug}-india/`) || file.includes(`/${slug}-india/`)).length;
  const districts = districtsByState.get(officialName) || 0;
  return { slug, officialName, districts, approvedTiles: usable, minimumGaps: Math.max(0, districts - usable) };
});
fs.mkdirSync("docs/qa", { recursive: true });
fs.writeFileSync("docs/qa/state-imagery-audit.json", JSON.stringify({ source: "Survey of India district DBF + public/images/location-library only", rows, totalDistricts: rows.reduce((sum, row) => sum + row.districts, 0), minimumGapTiles: rows.reduce((sum, row) => sum + row.minimumGaps, 0) }, null, 2) + "\n");
console.table(rows.map(({ slug, districts, approvedTiles, minimumGaps }) => ({ slug, districts, approvedTiles, minimumGaps })));
console.log(`Total minimum gap tiles: ${rows.reduce((sum, row) => sum + row.minimumGaps, 0)}`);
