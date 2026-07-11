import { defineConfig } from 'vite';
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
