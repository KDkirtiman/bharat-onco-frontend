import type { ArgTypes } from '@storybook/react';
import type { Preview } from '@storybook/react-vite';

import { ThemeProvider, type ThemeName } from '../src/designSystem/tokens/ThemeProvider';
import '../src/designSystem/tokens/globals.css';

import { DocsPage } from './DocsPage';
import { setPreviewTheme } from '../src/designSystem/playground/previewTheme';
import './docs-overrides.css';

/** ReactNode slots are not editable in Controls — hide them to avoid raw element dumps. */
const slotArgTypes: ArgTypes = {
  actions: { control: false, table: { type: { summary: 'ReactNode' } } },
  children: { control: false, table: { type: { summary: 'ReactNode' } } },
  icon: { control: false, table: { type: { summary: 'ReactNode' } } },
  startIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
  endIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
  startAdornment: { control: false, table: { type: { summary: 'ReactNode' } } },
  endAdornment: { control: false, table: { type: { summary: 'ReactNode' } } },
  footer: { control: false, table: { type: { summary: 'ReactNode' } } },
  header: { control: false, table: { type: { summary: 'ReactNode' } } },
  logo: { control: false, table: { type: { summary: 'ReactNode' } } },
  nav: { control: false, table: { type: { summary: 'ReactNode' } } },
  grouped: { control: false, table: { disable: true } },
};

const preview: Preview = {
  argTypes: slotArgTypes,
  globalTypes: {
    dsTheme: {
      description: 'Design system theme preset',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'contrast', title: 'Contrast' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    dsTheme: 'default',
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.dsTheme ?? 'default') as ThemeName;
      setPreviewTheme(theme);
      return (
        <ThemeProvider theme={theme}>
          <div style={{ padding: 'var(--ds-space-4)', minHeight: '100%' }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
      page: DocsPage,
      source: {
        dark: false,
        language: 'tsx',
        transform: (code, context) => {
          const usage = context.parameters?.usageCode;
          return typeof usage === 'string' && usage.trim() ? usage : code;
        },
      },
      canvas: { sourceState: 'closed' },
      story: { canvas: { sourceState: 'closed' } },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
        wide: {
          name: 'Wide desktop',
          styles: { width: '1536px', height: '900px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'desktop',
    },
    chromatic: {
      modes: {
        mobile: { viewport: 'mobile' },
        desktop: { viewport: 'desktop' },
      },
    },
    a11y: {
      // Use Accessibility panel in Storybook; CI fails via vitest.setup overrides
      test: 'todo',
    },
  },
};

export default preview;
