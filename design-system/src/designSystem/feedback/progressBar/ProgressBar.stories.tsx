import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './ProgressBar';
const meta: Meta<typeof ProgressBar> = {
  tags: ['autodocs'],
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
    parameters: {
    docs: {
      description: { component: "**ProgressBar** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "ProgressBar component",
      guide: {
  "whenToUse": [
    "Use **ProgressBar** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline ProgressBar configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<ProgressBar value={65} label="Upload progress" />);`,
        usageCode: `import { ProgressBar } from '@/designSystem';

export function Example() {
  return (
    <ProgressBar value={65} label="Upload progress" />
  );
}`,
  },
  args: {
    value: 45,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <ProgressBar {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    value: 72,
    showLabel: true,
    label: 'Upload progress',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ProgressBar {...args} />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Processing',
    showLabel: true,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ProgressBar {...args} />
    </div>
  ),
};
