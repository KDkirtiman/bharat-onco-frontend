import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORE = path.join(ROOT, "src/packages/bfd-core/src");
const PATTERNS = path.join(ROOT, "src/packages/bfd-patterns/src");
const STORYBOOK = path.join(ROOT, "src/apps/storybook");

// 1. Move datapoints from patterns to core
const dpSrc = path.join(PATTERNS, "datapoints");
const dpDst = path.join(CORE, "datapoints");
if (fs.existsSync(dpSrc) && !fs.existsSync(dpDst)) {
  fs.renameSync(dpSrc, dpDst);
  console.log("moved datapoints to bfd-core");
}

// 2. Copy assets to core
const assetsSrc = path.join(STORYBOOK, "assets");
const assetsDst = path.join(CORE, "assets");
if (fs.existsSync(assetsSrc)) {
  fs.mkdirSync(assetsDst, { recursive: true });
  for (const f of fs.readdirSync(assetsSrc)) {
    fs.copyFileSync(path.join(assetsSrc, f), path.join(assetsDst, f));
  }
}

function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, cb);
    else if (/\.(tsx?)$/.test(ent.name)) cb(p);
  }
}

const replacements = [
  [/from '\.\.\/\.\.\/components\/controls\/([^']+)'/g, "from 'bfd-core'"],
  [/from '\.\.\/\.\.\/components\/feedback\/([^']+)'/g, "from 'bfd-core'"],
  [/from '\.\.\/\.\.\/components\/data-display\/([^']+)'/g, "from 'bfd-core'"],
  [/from '\.\.\/\.\.\/components\/layout\/([^']+)'/g, "from 'bfd-core'"],
  [/from '\.\.\/lib\/cn'/g, "from 'bfd-core'"],
  [/from '\.\.\/lib\/formatters'/g, "from 'bfd-core'"],
  [/from '\.\.\/datapoints\//g, "from 'bfd-core/datapoints/"],
  [/from '\.\.\/\.\.\/datapoints\//g, "from 'bfd-core/datapoints/"],
  [/from '\.\.\/\.\.\/stories\/fixtures'/g, "from '@storybook/fixtures'"],
  [/from '\.\.\/\.\.\/stories\/overlayStoryParams'/g, "from '@storybook/overlay-params'"],
  [/bg-orange-surface-soft0/g, "bg-orange-surface-soft"],
];

for (const root of [PATTERNS, CORE]) {
  walk(root, (file) => {
    let s = fs.readFileSync(file, "utf8");
    let changed = false;
    for (const [re, rep] of replacements) {
      if (re.test(s)) { s = s.replace(re, rep); changed = true; }
    }
    if (changed) fs.writeFileSync(file, s);
  });
}

// bfd-core index - export datapoints
const coreIndex = path.join(CORE, "index.ts");
let idx = fs.readFileSync(coreIndex, "utf8");
if (!idx.includes("datapoints")) {
  idx += "\nexport * from './datapoints/auth';\nexport * from './datapoints/patients';\nexport * from './datapoints/scheduling';\nexport * from './datapoints/staging';\nexport * from './datapoints/clinical';\nexport * from './datapoints/treatment';\nexport * from './datapoints/billing';\nexport * from './datapoints/medications';\nexport * from './datapoints/chairs';\nexport * from './datapoints/inventory';\nexport * from './datapoints/geodata';\n";
  fs.writeFileSync(coreIndex, idx);
}

// bfd-core package.json subpath exports for datapoints
const corePkg = JSON.parse(fs.readFileSync(path.join(ROOT, "src/packages/bfd-core/package.json"), "utf8"));
corePkg.exports = {
  ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
  "./datapoints/*": { import: "./dist/datapoints/*.js" }
};
fs.writeFileSync(path.join(ROOT, "src/packages/bfd-core/package.json"), JSON.stringify(corePkg, null, 2));

// patterns index - re-export datapoints from core
const patIndex = path.join(PATTERNS, "index.ts");
let pi = fs.readFileSync(patIndex, "utf8");
if (!pi.includes("bfd-core/datapoints")) {
  pi = "export * from 'bfd-core';\n" + pi;
  fs.writeFileSync(patIndex, pi);
}

// storybook aliases
const sbMain = fs.readFileSync(path.join(STORYBOOK, ".storybook/main.ts"), "utf8");
let sb = sbMain;
if (!sb.includes("@storybook/fixtures")) {
  sb = sb.replace(
    "'bfd-patterns': pkg('bfd-patterns') + '/index.ts',",
    `'bfd-patterns': pkg('bfd-patterns') + '/index.ts',
          '@storybook/fixtures': path.resolve(__dirname, '../stories/fixtures.ts'),
          '@storybook/overlay-params': path.resolve(__dirname, '../stories/overlayStoryParams.ts'),`
  );
  fs.writeFileSync(path.join(STORYBOOK, ".storybook/main.ts"), sb);
}

// register shim for root package
fs.writeFileSync(path.join(ROOT, "src/register-shim.ts"), "import 'bfd-themes/register';\n");

console.log("imports fixed");
