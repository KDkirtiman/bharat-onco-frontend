import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
  args: {
    padding: 'md',
    children: (
      <div>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Card title</div>
        <div style={{ color: 'var(--ds-color-muted)' }}>
          Cards are the main surface used in dashboards, forms, and tables.
        </div>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const PaddingVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      <Card padding="sm">Small padding</Card>
      <Card padding="md">Medium padding</Card>
      <Card padding="lg">Large padding</Card>
    </div>
  ),
};

