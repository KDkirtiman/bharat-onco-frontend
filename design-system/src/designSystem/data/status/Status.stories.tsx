import type { Meta, StoryObj } from '@storybook/react';

import { Status } from './Status';
const meta: Meta<typeof Status> = {
  tags: ['autodocs'],
  title: 'Data/Status',
  component: Status,
    parameters: {
    docs: {
      description: { component: "**Status** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Status component",
      guide: {
  "whenToUse": [
    "Use **Status** in data flows where this UI pattern is needed.",
    "Prefer composing with other design-system primitives rather than custom markup."
  ],
  "capabilities": [
    "Themeable via CSS variables (`ThemeProvider` or token overrides)",
    "`className` and standard HTML/React props passthrough where applicable",
    "Multiple stories demonstrating states and variants"
  ],
  "scenarios": [
    {
      "title": "Default",
      "description": "Baseline Status configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Status tone="success" label="Active" />);`,
        usageCode: `import { Status } from '@/designSystem';

export function Example() {
  return (
    <Status tone="success" label="Active" />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Status>;

export const Default: Story = {
  args: { children: 'Active', tone: 'success' },
};

export const Dot: Story = {
  args: { children: 'Pending review', tone: 'warning', variant: 'dot' },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Status tone="neutral">Draft</Status>
      <Status tone="success">Approved</Status>
      <Status tone="warning">Pending</Status>
      <Status tone="danger">Rejected</Status>
      <Status tone="info">In review</Status>
    </div>
  ),
};
