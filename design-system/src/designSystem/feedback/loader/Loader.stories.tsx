import type { Meta, StoryObj } from '@storybook/react';

import { Loader } from './Loader';
const meta: Meta<typeof Loader> = {
  tags: ['autodocs'],
  title: 'Feedback/Loader',
  component: Loader,
    parameters: {
    docs: {
      description: { component: "**Loader** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Loader component",
      guide: {
  "whenToUse": [
    "Use **Loader** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline Loader configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Loader variant="spinner" label="Loading…" />);`,
        usageCode: `import { Loader } from '@/designSystem';

export function Example() {
  return (
    <Loader variant="spinner" label="Loading…" />
  );
}`,
  },
  args: {
    variant: 'spinner',
    size: 'md',
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Loader>;

export const Spinner: Story = {};

export const SpinnerSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Loader size="sm" />
      <Loader size="md" />
      <Loader size="lg" />
    </div>
  ),
};

export const Linear: Story = {
  args: { variant: 'linear' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Loader {...args} />
    </div>
  ),
};

export const LinearSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Loader variant="linear" size="sm" />
      <Loader variant="linear" size="md" />
      <Loader variant="linear" size="lg" />
    </div>
  ),
};
