import { execSync } from "node:child_process";

const BASE = process.argv[2] || "http://localhost:53143";

// ---- Extract hrefs from navLinks.ts / footerLinks.ts ----
const navSrc = execSync("cat src/data/navLinks.ts", { encoding: "utf8" });
const footSrc = execSync("cat src/data/footerLinks.ts", { encoding: "utf8" });
const navbarSrc = execSync("cat src/components/layout/Navbar.tsx", { encoding: "utf8" });
const footerSrc = execSync("cat src/components/layout/Footer.tsx", { encoding: "utf8" });

const byHref = new Map();
const collect = (src, where) => {
  for (const re of [/href="([^"]+)"/g, /href:\s*"([^"]+)"/g]) {
    let m;
    while ((m = re.exec(src)) !== null) {
      const h = m[1];
      if (h === "#") continue;
      if (!byHref.has(h)) byHref.set(h, where);
    }
  }
};
collect(navSrc, "navLinks.ts");
collect(footSrc, "footerLinks.ts");
collect(navbarSrc, "Navbar.tsx");
collect(footerSrc, "Footer.tsx");

const results = [];
for (const [href, where] of byHref) {
  try {
    const res = await fetch(BASE + href, { redirect: "follow", signal: AbortSignal.timeout(60000) });
    results.push({ href, where, code: res.status, final: res.url.replace(BASE, "") });
  } catch (e) {
    results.push({ href, where, code: "ERR", final: String(e.message).slice(0, 80) });
  }
}

results.sort((a, b) => (a.code === b.code ? 0 : a.code < b.code ? -1 : 1));
for (const r of results) {
  const flag = r.code === 404 ? "  <<< 404" : r.code === "ERR" ? "  <<< ERR" : "";
  console.log(`${r.code}\t${r.href}\t(${r.where})${r.final !== r.href ? ` -> ${r.final}` : ""}${flag}`);
}
