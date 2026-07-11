import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
function w(f,c){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,c);}

const libVite = (entry) => `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: resolve(__dirname, '${entry}'), formats: ['es'], fileName: 'index' },
    rollupOptions: { external: [/^(bfd-|react|@radix-ui|lucide|date-fns|clsx|class-variance|tailwind-merge|react-day-picker)/] },
  },
});
`;

w("src/packages/bfd-core/vite.config.ts", libVite("src/index.ts"));
w("src/packages/bfd-icons/vite.config.ts", libVite("src/index.ts"));
w("src/packages/bfd-patterns/vite.config.ts", libVite("src/index.ts"));
w("src/packages/bfd-tables/vite.config.ts", libVite("src/index.ts"));

w("src/packages/bfd-themes/vite.config.ts", `import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        register: resolve(__dirname, 'src/register.ts'),
        'tailwind-preset': resolve(__dirname, 'src/tailwind-preset.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: { output: { entryFileNames: '[name].js' } },
  },
});
`);

const sbMain = fs.readFileSync("src/apps/storybook/.storybook/main.ts","utf8");
const aliasBlock = `
import path from 'path';
const pkg = (name) => path.resolve(__dirname, '../../packages', name, 'src');
`;
let updated = sbMain;
if (!sbMain.includes("bfd-themes")) {
  updated = updated.replace(
    "import type { StorybookConfig }",
    aliasBlock + "import type { StorybookConfig }"
  );
  updated = updated.replace(
    "return mergeConfig(config, {",
    `return mergeConfig(config, {
      resolve: {
        alias: {
          'bfd-themes/register': pkg('bfd-themes') + '/register.ts',
          'bfd-themes': pkg('bfd-themes') + '/index.ts',
          'bfd-icons': pkg('bfd-icons') + '/index.ts',
          'bfd-core': pkg('bfd-core') + '/index.ts',
          'bfd-tables': pkg('bfd-tables') + '/index.ts',
          'bfd-patterns': pkg('bfd-patterns') + '/index.ts',
        },
      },`
  );
}
fs.writeFileSync("src/apps/storybook/.storybook/main.ts", updated);

w("vite.config.ts", `import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
export default defineConfig({
  plugins: [dts({ include: ['src/shim.ts'], rollupTypes: true })],
  build: {
    lib: {
      entry: { 'bharat-onco-frontend': resolve(__dirname, 'src/shim.ts') },
      formats: ['es','cjs'],
      fileName: (format, name) => format === 'es' ? name + '.js' : name + '.cjs',
    },
    rollupOptions: {
      external: [/^bfd-/, 'react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
`);

const rootPkg = JSON.parse(fs.readFileSync("package.json","utf8"));
rootPkg.exports = {
  ".": { types: "./dist/bharat-onco-frontend.d.ts", import: "./dist/bharat-onco-frontend.js", require: "./dist/bharat-onco-frontend.cjs" },
  "./register": { import: "./dist/register.js" },
  "./styles.css": "./src/packages/bfd-themes/dist/styles.css",
  "./tailwind-preset": { import: "./src/packages/bfd-themes/dist/tailwind-preset.js" }
};
rootPkg.scripts.build = "npm run build --workspace=bfd-themes && npm run build --workspace=bfd-icons && npm run build --workspace=bfd-core && npm run build --workspace=bfd-tables && npm run build --workspace=bfd-patterns && vite build";
fs.writeFileSync("package.json", JSON.stringify(rootPkg,null,2));

console.log("vite configs written");
