import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Core/Avatar',
  component: Avatar,
  args: { size: 'md', alt: 'User' },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Placeholder: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient',
    alt: 'Patient',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar size="sm" alt="S" />
      <Avatar size="md" alt="M" />
      <Avatar size="lg" alt="L" />
    </div>
  ),
};

export const NameCellPattern: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar size="sm" alt="" />
      <span style={{ fontWeight: 600 }}>Rajesh Kumar</span>
    </div>
  ),
};
