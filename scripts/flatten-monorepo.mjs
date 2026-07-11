/**
 * Flatten monorepo layout:
 *   src/packages/bfd-X/src  ->  packages/bfd-X
 *   src/apps                ->  apps
 *   src/shim.ts etc.        ->  root
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function moveDirContents(from, to) {
  if (!fs.existsSync(from)) return;
  mkdirp(to);
  for (const name of fs.readdirSync(from)) {
    const src = path.join(from, name);
    const dst = path.join(to, name);
    if (fs.existsSync(dst)) rmrf(dst);
    fs.renameSync(src, dst);
  }
}

// 1. Lift each package: src/packages/X/src/* → packages/X/*
const srcPackages = path.join(ROOT, 'src/packages');
const packagesRoot = path.join(ROOT, 'packages');
mkdirp(packagesRoot);

if (fs.existsSync(srcPackages)) {
  for (const name of fs.readdirSync(srcPackages)) {
    const oldPkg = path.join(srcPackages, name);
    if (!fs.statSync(oldPkg).isDirectory()) continue;

    const newPkg = path.join(packagesRoot, name);
    mkdirp(newPkg);

    // package metadata + build output
    for (const file of ['package.json', 'vite.config.ts', 'tsconfig.json']) {
      const f = path.join(oldPkg, file);
      if (fs.existsSync(f)) fs.renameSync(f, path.join(newPkg, file));
    }
    const dist = path.join(oldPkg, 'dist');
    if (fs.existsSync(dist)) {
      fs.renameSync(dist, path.join(newPkg, 'dist'));
    }

    // lift inner src/
    const innerSrc = path.join(oldPkg, 'src');
    if (fs.existsSync(innerSrc)) {
      moveDirContents(innerSrc, newPkg);
      rmrf(innerSrc);
    }

    rmrf(oldPkg);
    console.log('flattened package:', name);
  }
  rmrf(srcPackages);
}

// 2. Move apps
const srcApps = path.join(ROOT, 'src/apps');
const appsRoot = path.join(ROOT, 'apps');
if (fs.existsSync(srcApps)) {
  mkdirp(appsRoot);
  for (const name of fs.readdirSync(srcApps)) {
    const from = path.join(srcApps, name);
    const to = path.join(appsRoot, name);
    if (fs.existsSync(to)) rmrf(to);
    fs.renameSync(from, to);
    console.log('moved app:', name);
  }
  rmrf(srcApps);
}

// 3. Move root shim files out of src/
for (const file of ['shim.ts', 'register-shim.ts', 'index.ts']) {
  const from = path.join(ROOT, 'src', file);
  const to = path.join(ROOT, file);
  if (fs.existsSync(from)) {
    if (fs.existsSync(to)) fs.unlinkSync(to);
    fs.renameSync(from, to);
  }
}
rmrf(path.join(ROOT, 'src'));

// 4. Fix relative imports — one fewer "src/" segment in package paths
function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', 'dist', 'storybook-static'].includes(ent.name)) continue;
      walk(p, cb);
    } else if (/\.(tsx?|mjs|json)$/.test(ent.name)) {
      cb(p);
    }
  }
}

const importFixes = [
  // bfd-core: components/*/Callout was 4 deep from package src root, now 3 — lib/datapoints/assets one less ../
  [/from '\.\.\/\.\.\/\.\.\/lib\//g, "from '../../lib/"],
  [/from '\.\.\/\.\.\/\.\.\/datapoints\//g, "from '../../datapoints/"],
  [/from '\.\.\/\.\.\/\.\.\/assets\//g, "from '../../assets/"],
  // patterns: was 5 levels to lib in some files, adjust common cases
  [/from '\.\.\/\.\.\/\.\.\/\.\.\/lib\//g, "from '../../../lib/"],
  [/from '\.\.\/\.\.\/\.\.\/lib\//g, "from '../../lib/"],
  // storybook fixtures paths in stories (if any broke)
  [/from '\.\.\/\.\.\/\.\.\/packages\//g, "from '../../../packages/"],
];

walk(packagesRoot, (file) => {
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [re, rep] of importFixes) {
    if (re.test(s)) {
      s = s.replace(re, rep);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, s);
});

walk(appsRoot, (file) => {
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;
  const fixes = [
    [/\.\.\/\.\.\/packages\/bfd-core\/src\//g, '../../../packages/bfd-core/'],
    [/\.\.\/\.\.\/packages\/bfd-patterns\/src\//g, '../../../packages/bfd-patterns/'],
    [/path\.resolve\(__dirname, '\.\.\/\.\.\/packages', name, 'src'\)/g,
      "path.resolve(__dirname, '../../../packages', name)"],
    [/'\.\.\/\.\.\/packages\/bfd-core\/src/g, "'../../../packages/bfd-core"],
    [/'\.\.\/\.\.\/packages\/bfd-patterns\/src/g, "'../../../packages/bfd-patterns"],
  ];
  for (const [re, rep] of fixes) {
    if (re.test(s)) {
      s = s.replace(re, rep);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, s);
});

// 5. Update package.json files
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
rootPkg.workspaces = ['packages/*', 'apps/*'];
rootPkg.exports['./styles.css'] = './packages/bfd-themes/dist/styles.css';
rootPkg.exports['./tailwind-preset'].import = './packages/bfd-themes/dist/tailwind-preset.js';
fs.writeFileSync(path.join(ROOT, 'package.json'), JSON.stringify(rootPkg, null, 2) + '\n');

for (const name of fs.readdirSync(packagesRoot)) {
  const pkgFile = path.join(packagesRoot, name, 'package.json');
  if (!fs.existsSync(pkgFile)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
  if (pkg.scripts?.build?.includes('../../../scripts')) {
    pkg.scripts.build = 'node ../../scripts/build-all.mjs';
  }
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
}

// 6. Update build-all.mjs
const buildAll = `import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const PKG_ROOT = path.join(ROOT, "packages");

const EXTERNAL = [
  "react", "react-dom", "react/jsx-runtime",
  "lucide-react", "bfd-themes", "bfd-icons", "bfd-core", "bfd-tables", "bfd-patterns",
  "clsx", "class-variance-authority", "tailwind-merge", "react-day-picker",
  "@radix-ui/react-dialog", "@radix-ui/react-label", "@radix-ui/react-popover",
  "@radix-ui/react-select", "@radix-ui/react-separator", "@radix-ui/react-slot",
  "@radix-ui/react-tooltip", "date-fns",
];

async function buildPkg(name, opts = {}) {
  const dir = path.join(PKG_ROOT, name);
  const out = path.join(dir, "dist");
  fs.mkdirSync(out, { recursive: true });
  const entries = opts.entries ?? [{ in: "index.ts", out: "index" }];
  for (const e of entries) {
    await esbuild.build({
      entryPoints: [path.join(dir, e.in)],
      outfile: path.join(out, \`\${e.out}.js\`),
      bundle: true,
      format: "esm",
      platform: "browser",
      target: "es2022",
      jsx: "automatic",
      external: EXTERNAL,
      loader: { ".svg": "dataurl", ".css": "empty" },
    });
    console.log(\`built \${name}/\${e.out}.js\`);
  }
}

const themesDir = path.join(PKG_ROOT, "bfd-themes");
const themesOut = path.join(themesDir, "dist");
fs.mkdirSync(themesOut, { recursive: true });
await buildPkg("bfd-themes", {
  entries: [
    { in: "index.ts", out: "index" },
    { in: "tailwind-preset.ts", out: "tailwind-preset" },
  ],
});
fs.writeFileSync(path.join(themesOut, "register.js"), "import './styles.css';\\n");
execSync("npx @tailwindcss/cli -i ./styles/index.css -o ./dist/styles.css --minify", {
  cwd: themesDir, stdio: "inherit",
});

await buildPkg("bfd-icons");
await buildPkg("bfd-core");
await buildPkg("bfd-tables");
await buildPkg("bfd-patterns");

const dist = path.join(ROOT, "dist");
fs.mkdirSync(dist, { recursive: true });
await esbuild.build({
  entryPoints: [path.join(ROOT, "shim.ts")],
  outfile: path.join(dist, "bharat-onco-frontend.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  external: EXTERNAL,
  loader: { ".css": "empty", ".svg": "dataurl" },
});
await esbuild.build({
  entryPoints: [path.join(ROOT, "shim.ts")],
  outfile: path.join(dist, "bharat-onco-frontend.cjs"),
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  external: EXTERNAL,
  loader: { ".css": "empty", ".svg": "dataurl" },
});
fs.writeFileSync(path.join(dist, "register.js"), "import 'bfd-themes/register';\\n");

console.log("all packages built");
`;
fs.writeFileSync(path.join(ROOT, 'scripts/build-all.mjs'), buildAll);

// 7. Rewrite storybook main.ts cleanly
const sbMain = path.join(ROOT, 'apps/storybook/.storybook/main.ts');
if (fs.existsSync(sbMain)) {
  fs.writeFileSync(
    sbMain,
    `import path from 'path';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

const pkg = (name: string) => path.resolve(__dirname, '../../../packages', name);

const config: StorybookConfig = {
  stories: [
    '../../../packages/bfd-core/**/*.stories.@(ts|tsx)',
    '../../../packages/bfd-patterns/**/*.stories.@(ts|tsx)',
    '../foundations/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          'bfd-themes/register': pkg('bfd-themes') + '/register.ts',
          'bfd-themes': pkg('bfd-themes') + '/index.ts',
          'bfd-icons': pkg('bfd-icons') + '/index.ts',
          'bfd-core': pkg('bfd-core') + '/index.ts',
          'bfd-tables': pkg('bfd-tables') + '/index.ts',
          'bfd-patterns': pkg('bfd-patterns') + '/index.ts',
          '@storybook/fixtures': path.resolve(__dirname, '../stories/fixtures.ts'),
          '@storybook/overlay-params': path.resolve(__dirname, '../stories/overlayStoryParams.ts'),
        },
      },
      base: process.env.GITHUB_ACTIONS ? '/bharat-onco-frontend/' : '/',
      plugins: [tailwindcss(), svgr()],
    });
  },
};

export default config;
`,
  );
}

// 8. Update bfd-themes package.json build:css path
const themesPkgFile = path.join(packagesRoot, 'bfd-themes/package.json');
if (fs.existsSync(themesPkgFile)) {
  const t = JSON.parse(fs.readFileSync(themesPkgFile, 'utf8'));
  if (t.scripts?.['build:css']) {
    t.scripts['build:css'] = 'npx @tailwindcss/cli -i ./styles/index.css -o ./dist/styles.css --minify';
  }
  fs.writeFileSync(themesPkgFile, JSON.stringify(t, null, 2) + '\n');
}

// 9. Update tsconfig.build.json
fs.writeFileSync(
  path.join(ROOT, 'tsconfig.build.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2023',
        lib: ['ES2023', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outDir: './dist',
        rootDir: '.',
        skipLibCheck: true,
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        verbatimModuleSyntax: true,
        types: ['vite/client'],
      },
      include: ['shim.ts', 'register-shim.ts'],
      exclude: ['**/*.stories.tsx', 'packages/**', 'apps/**'],
    },
    null,
    2,
  ) + '\n',
);

// 10. Update CONTRIBUTING paths
const contributing = path.join(ROOT, 'CONTRIBUTING.md');
if (fs.existsSync(contributing)) {
  let c = fs.readFileSync(contributing, 'utf8');
  c = c.replace(/src\/packages\//g, 'packages/');
  c = c.replace(/src\/apps\//g, 'apps/');
  fs.writeFileSync(contributing, c);
}

console.log('flatten complete');
