import path from 'path';
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
