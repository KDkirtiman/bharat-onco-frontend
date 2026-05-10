import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Core/Badge',
  component: Badge,
  args: { children: 'Active', tone: 'success' },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Badge tone="neutral">Walk-in</Badge>
      <Badge tone="info">Referred</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="danger">Inactive</Badge>
    </div>
  ),
};

