import * as esbuild from "esbuild";
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
      outfile: path.join(out, `${e.out}.js`),
      bundle: true,
      format: "esm",
      platform: "browser",
      target: "es2022",
      jsx: "automatic",
      external: EXTERNAL,
      loader: { ".svg": "dataurl", ".css": "empty" },
    });
    console.log(`built ${name}/${e.out}.js`);
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
fs.writeFileSync(path.join(themesDir, "dist/register.js"), "import './styles.css';\n");
execSync("npx @tailwindcss/cli -i ./styles/index.css -o ./dist/styles.css --minify", {
  cwd: themesDir, stdio: "inherit",
});

await buildPkg("bfd-icons");
fs.writeFileSync(
  path.join(PKG_ROOT, "bfd-icons/dist/index.d.ts"),
  "export * from 'lucide-react';\n",
);
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
fs.writeFileSync(path.join(dist, "register.js"), "import 'bfd-themes/register';\n");
console.log("all packages built");
