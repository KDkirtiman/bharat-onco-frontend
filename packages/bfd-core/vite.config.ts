import { defineConfig } from 'vite';
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
