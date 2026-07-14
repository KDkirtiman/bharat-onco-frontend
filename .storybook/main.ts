import path from 'path';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

const pkg = (name: string) => path.resolve(__dirname, '../packages', name);

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    // Storybook auto-merges the root vite.config.ts (the library build config), which
    // externalizes react/bfd-* for the published package and adds vite-plugin-dts.
    // Neither belongs in the Storybook preview bundle — strip them before layering ours on top.
    if (config.build?.rollupOptions) {
      delete config.build.rollupOptions.external;
    }
    config.plugins = (config.plugins ?? []).filter((p) => {
      const name = Array.isArray(p) || !p ? '' : (p as { name?: string }).name ?? '';
      return !name.includes('dts');
    });
    return mergeConfig(config, {
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react-dom/client',
          'clsx',
          'tailwind-merge',
          'lucide-react',
        ],
      },
      resolve: {
        alias: {
          'bfd-themes/register': pkg('bfd-themes') + '/register.ts',
          'bfd-core/datapoints': pkg('bfd-core') + '/datapoints',
          'bfd-themes': pkg('bfd-themes') + '/index.ts',
          'bfd-icons': pkg('bfd-icons') + '/index.ts',
          'bfd-core': pkg('bfd-core') + '/index.ts',
          'bfd-tables': pkg('bfd-tables') + '/index.ts',
          'bfd-patterns': pkg('bfd-patterns') + '/index.ts',
          '@storybook/fixtures': path.resolve(__dirname, 'fixtures.ts'),
          '@storybook/overlay-params': path.resolve(__dirname, 'overlayStoryParams.ts'),
        },
      },
      base: process.env.GITHUB_ACTIONS ? '/bharat-onco-frontend/' : '/',
      plugins: [react(), tailwindcss(), svgr()],
    });
  },
};

export default config;
