import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
export default defineConfig({
  plugins: [dts({ include: ['shim.ts', 'register-shim.ts'], rollupTypes: true })],
  build: {
    lib: {
      entry: {
        'bharat-onco-frontend': resolve(__dirname, 'shim.ts'),
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
