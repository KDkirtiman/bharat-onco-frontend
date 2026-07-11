import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  try {
    fs.rmSync(p, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    console.log('removed:', path.relative(ROOT, p));
  } catch (e) {
    console.warn('could not remove', p, e.message);
  }
}

// Move storybook app
const srcStorybook = path.join(ROOT, 'src/apps/storybook');
const appsStorybook = path.join(ROOT, 'apps/storybook');
if (fs.existsSync(srcStorybook)) {
  fs.mkdirSync(path.join(ROOT, 'apps'), { recursive: true });
  if (fs.existsSync(appsStorybook)) rmrf(appsStorybook);
  fs.renameSync(srcStorybook, appsStorybook);
  console.log('moved storybook to apps/');
}

// Move shim files to root
for (const f of ['shim.ts', 'register-shim.ts', 'index.ts']) {
  const from = path.join(ROOT, 'src', f);
  const to = path.join(ROOT, f);
  if (fs.existsSync(from)) {
    if (fs.existsSync(to)) fs.unlinkSync(to);
    fs.renameSync(from, to);
  }
}

// Remove entire legacy src tree
rmrf(path.join(ROOT, 'src'));

// Update root package.json
const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.workspaces = ['packages/*', 'apps/*'];
pkg.exports['./styles.css'] = './packages/bfd-themes/dist/styles.css';
pkg.exports['./tailwind-preset'] = { import: './packages/bfd-themes/dist/tailwind-preset.js' };
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Update per-package build script path
for (const name of fs.readdirSync(path.join(ROOT, 'packages'))) {
  const p = path.join(ROOT, 'packages', name, 'package.json');
  if (!fs.existsSync(p)) continue;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (j.scripts?.build) j.scripts.build = 'node ../../scripts/build-all.mjs';
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}

// Storybook main.ts
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
  framework: { name: '@storybook/react-vite', options: {} },
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

// build-all.mjs
fs.writeFileSync(
  path.join(ROOT, 'scripts/build-all.mjs'),
  `import * as esbuild from "esbuild";
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
fs.mkdirSync(path.join(themesDir, "dist"), { recursive: true });
await buildPkg("bfd-themes", {
  entries: [
    { in: "index.ts", out: "index" },
    { in: "tailwind-preset.ts", out: "tailwind-preset" },
  ],
});
fs.writeFileSync(path.join(themesDir, "dist/register.js"), "import './styles.css';\\n");
execSync("npx @tailwindcss/cli -i ./styles/index.css -o ./dist/styles.css --minify", {
  cwd: themesDir, stdio: "inherit",
});

await buildPkg("bfd-icons");
await buildPkg("bfd-core");
await buildPkg("bfd-tables");
await buildPkg("bfd-patterns");

const dist = path.join(ROOT, "dist");
fs.mkdirSync(dist, { recursive: true });
for (const [outfile, format] of [
  ["bharat-onco-frontend.js", "esm"],
  ["bharat-onco-frontend.cjs", "cjs"],
]) {
  await esbuild.build({
    entryPoints: [path.join(ROOT, "shim.ts")],
    outfile: path.join(dist, outfile),
    bundle: true,
    format,
    platform: "browser",
    target: "es2022",
    jsx: "automatic",
    external: EXTERNAL,
    loader: { ".css": "empty", ".svg": "dataurl" },
  });
}
fs.writeFileSync(path.join(dist, "register.js"), "import 'bfd-themes/register';\\n");
console.log("all packages built");
`,
);

console.log('finish-flatten done');
