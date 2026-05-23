import type { Meta, StoryObj } from '@storybook/react';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  tags: ['autodocs'],
  title: 'Icons/Logo',
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          'Official **Bharat Oncology** brand mark. Source file: `icons/bharat-oncology-logo.svg` (also in `public/` for favicons).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
      <Logo size="xl" />
    </div>
  ),
};

export const OnDark: Story = {
  render: () => (
    <div style={{ padding: 24, background: '#1a1028', borderRadius: 8 }}>
      <Logo size="lg" />
    </div>
  ),
};
