// Compare two styles.json files and print a diff table.
// Usage: node scripts/parity/compare.mjs <refStyles.json> <mqtStyles.json> <selectorPairsJson>
// selectorPairsJson: [["refSel","mqtSel"], ...] with a human label
import fs from 'fs';

const [refFile, mqtFile, pairsFile] = process.argv.slice(2);
const ref = JSON.parse(fs.readFileSync(refFile, 'utf8'));
const mqt = JSON.parse(fs.readFileSync(mqtFile, 'utf8'));
const pairs = JSON.parse(fs.readFileSync(pairsFile, 'utf8'));

const PROPS = [
  'width', 'height',
  'font-size', 'font-weight', 'line-height', 'color',
  'background-color', 'border-radius', 'box-shadow',
  'border-top-width', 'border-bottom-width', 'border-left-width',
  'border-top-color', 'border-bottom-color', 'border-left-color',
  'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
  'margin-top', 'margin-bottom', 'gap', 'text-align', 'display',
];

for (const [label, refSel, mqtSel] of pairs) {
  const r = ref[refSel];
  const m = mqt[mqtSel];
  if (!r) { console.log(`\n## ${label}\n  REF '${refSel}' NOT FOUND`); continue; }
  if (!m) { console.log(`\n## ${label}\n  MQT '${mqtSel}' NOT FOUND`); continue; }
  console.log(`\n## ${label}`);
  console.log(`  rect: REF ${r.rect.w}x${r.rect.h} @(${r.rect.x},${r.rect.y}) | MQT ${m.rect.w}x${m.rect.h} @(${m.rect.x},${m.rect.y})`);
  for (const p of PROPS) {
    const rv = r.props[p] || '';
    const mv = m.props[p] || '';
    if (rv === mv) continue;
    const flag = rv && mv && !['none', 'normal', 'auto'].includes(rv) ? '  <-- DIFF' : '';
    console.log(`  ${p}: REF="${rv}" MQT="${mv}"${flag}`);
  }
}
