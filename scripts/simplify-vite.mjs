import fs from "node:fs";
const themesVite = `import { defineConfig } from 'vite';
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
`;
fs.writeFileSync("src/packages/bfd-themes/vite.config.ts", themesVite);

const coreVite = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'index' },
    rollupOptions: {
      external: [/^(bfd-|react|@radix-ui|lucide|date-fns|clsx|class-variance|tailwind-merge|react-day-picker)/],
    },
  },
});
`;
fs.writeFileSync("src/packages/bfd-core/vite.config.ts", coreVite);

const libVite = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'index' },
    rollupOptions: { external: [/^(bfd-|react|@radix-ui|lucide|date-fns|clsx|class-variance|tailwind-merge|react-day-picker)/] },
  },
});
`;
for (const p of ["bfd-patterns", "bfd-tables", "bfd-icons"]) {
  fs.writeFileSync(`src/packages/${p}/vite.config.ts`, libVite);
}
console.log("simplified vite configs");
