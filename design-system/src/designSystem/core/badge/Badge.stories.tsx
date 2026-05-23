import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';
const meta: Meta<typeof Badge> = {
  tags: ['autodocs'],
  title: 'Core/Badge',
  component: Badge,
    parameters: {
    docs: {
      description: { component: "Non-interactive label for status, counts, or categories. Use `dot` for icon-only indicators." },
      subtitle: "Compact status or category chip",
      guide: {
  "whenToUse": [
    "Status on rows.",
    "Counts on tabs.",
    "Category tags in tables."
  ],
  "capabilities": [
    "Tones: neutral, success, warning, danger, info",
    "dot mode",
    "sizes sm/md"
  ],
  "scenarios": []
},
    },
    liveCode: `render(
  <div style={{ display: 'flex', gap: 8 }}>
    <Badge tone="success">Active</Badge>
    <Badge tone="warning">Pending</Badge>
  </div>
);`,
        usageCode: `import { Badge } from '@/designSystem';

export function Example() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
        <Badge tone="success">Active</Badge>
        <Badge tone="warning">Pending</Badge>
      </div>
  );
}`,
  },
  args: { children: 'Active', tone: 'success' },
  argTypes: {
    tone: { description: "Semantic color tone." },
    size: { description: "`sm` | `md`." },
    dot: { description: "Icon-only dot indicator." },
    children: { description: "Badge text." },
  },
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
