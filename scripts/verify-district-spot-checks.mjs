// Verifies the three mandatory Survey of India district spot-checks before a
// state may move beyond geometry preparation. This reads only generated,
// lightweight district paths — never the sub-district source dataset.
import fs from "node:fs";

const checks = {
  uttarakhand: [
    "ALMORA", "BAGESHWAR", "CHAMOLI", "CHAMPAWAT", "DEHRADUN", "HARIDWAR", "NAINITAL",
    "PAURI GARHWAL", "PITHORAGARH", "RUDRAPRAYAG", "TEHRI GARHWAL", "UDHAM SINGH NAGAR", "UTTARKASHI",
  ],
  "himachal-pradesh": [
    "BILASPUR", "CHAMBA", "HAMIRPUR", "KANGRA", "KINNAUR", "KULLU", "LAHUL & SPITI", "MANDI", "SHIMLA", "SIRMAUR", "SOLAN", "UNA",
  ],
  rajasthan: [
    "AJMER", "ALWAR", "BALOTRA", "BANSWARA", "BARAN", "BARMER", "BEAWAR", "BHARATPUR", "BHILWARA", "BIKANER", "BUNDI", "CHITTAURGARH", "CHURU", "DAUSA", "DEEG", "DHAULPUR", "DIDWANA-KUCHAMAN", "DUNGARPUR", "GANGANAGAR", "HANUMANGARH", "JAIPUR", "JAISALMER", "JALOR", "JHALAWAR", "JHUNJHUNUN", "JODHPUR", "KARAULI", "KHAIRTHAL-TIJARA", "KOTA", "KOTPUTLI-BEHROR", "NAGAUR", "PALI", "PHALODI", "PRATAPGARH", "RAJSAMAND", "SALUMBAR", "SAWAI MADHOPUR", "SIKAR", "SIROHI", "TONK", "UDAIPUR",
  ],
};

let failed = false;
for (const [slug, expected] of Object.entries(checks)) {
  const { districts, source } = JSON.parse(fs.readFileSync(`src/data/geography/${slug}.districts.json`, "utf8"));
  const actual = districts.map(({ name }) => name).sort();
  const matches = actual.length === expected.length && actual.every((name, index) => name === expected[index]);
  console.log(`${matches ? "PASS" : "FAIL"} ${slug}: ${actual.length}/${expected.length} districts — ${source}`);
  if (!matches) failed = true;
}

if (failed) process.exitCode = 1;
