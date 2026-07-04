import type { Meta, StoryObj } from '@storybook/react';

import { Icon, type IconName } from './Icon';

const NAMES: IconName[] = [
  'search',
  'user',
  'logout',
  'chevronLeft',
  'chevronRight',
  'panelLeftClose',
  'layoutDashboard',
  'calendar',
  'users',
  'heart',
];

const meta: Meta<typeof Icon> = {
  title: 'Icons/Icon',
  component: Icon,
  args: { name: 'search', size: 'md' },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {NAMES.map((name) => (
        <div key={name} style={{ textAlign: 'center', width: 72 }}>
          <Icon name={name} size="lg" />
          <div style={{ fontSize: 11, marginTop: 6, color: 'var(--ds-color-muted)' }}>{name}</div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
      <Icon name="user" size="sm" />
      <Icon name="user" size="md" />
      <Icon name="user" size="lg" />
    </div>
  ),
};
