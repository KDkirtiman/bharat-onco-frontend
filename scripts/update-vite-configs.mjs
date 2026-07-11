import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();

const coreVite = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react(), svgr(), dts({ include: ['src'], exclude: ['**/*.stories.tsx'] })],
  build: {
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'index' },
    rollupOptions: {
      external: [/^(bfd-|react|@radix-ui|lucide|date-fns|clsx|class-variance|tailwind-merge|react-day-picker)/],
    },
  },
});
`;
fs.writeFileSync("src/packages/bfd-core/vite.config.ts", coreVite);

const libVite = (name) => `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react(), dts({ include: ['src'], exclude: ['**/*.stories.tsx'] })],
  build: {
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'index' },
    rollupOptions: { external: [/^(bfd-|react|@radix-ui|lucide|date-fns|clsx|class-variance|tailwind-merge|react-day-picker)/] },
  },
});
`;
for (const p of ["bfd-patterns", "bfd-tables", "bfd-icons"]) {
  fs.writeFileSync(`src/packages/${p}/vite.config.ts`, libVite(p));
}

const themesVite = `import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
export default defineConfig({
  plugins: [dts({ include: ['src'] })],
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
`;
fs.writeFileSync("src/packages/bfd-themes/vite.config.ts", themesVite);

const rootVite = `import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
export default defineConfig({
  plugins: [dts({ include: ['src/shim.ts', 'src/register-shim.ts'], rollupTypes: true })],
  build: {
    lib: {
      entry: {
        'bharat-onco-frontend': resolve(__dirname, 'src/shim.ts'),
        register: resolve(__dirname, 'src/register-shim.ts'),
      },
      formats: ['es','cjs'],
      fileName: (format, name) => format === 'es' ? name + '.js' : name + '.cjs',
    },
    rollupOptions: {
      external: [/^bfd-/, 'react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
`;
fs.writeFileSync("vite.config.ts", rootVite);

const pkg = JSON.parse(fs.readFileSync("package.json","utf8"));
pkg.name = "@kdkirtiman/bharat-onco-frontend";
pkg.dependencies = pkg.dependencies || {};
Object.assign(pkg.dependencies, {
  "bfd-core": "*",
  "bfd-icons": "*",
  "bfd-patterns": "*",
  "bfd-tables": "*",
  "bfd-themes": "*",
});
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

console.log("updated vite + root package");
