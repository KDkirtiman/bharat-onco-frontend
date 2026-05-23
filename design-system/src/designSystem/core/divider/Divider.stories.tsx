import type { Meta, StoryObj } from '@storybook/react';

import { Divider } from './Divider';
const meta: Meta<typeof Divider> = {
  tags: ['autodocs'],
  title: 'Core/Divider',
  component: Divider,
    parameters: {
    docs: {
      description: { component: "**Divider** is part of the Core catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Divider component",
      guide: {
  "whenToUse": [
    "Use **Divider** in core flows where this UI pattern is needed.",
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
      "description": "Baseline Divider configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Divider label="Or continue with" />);`,
        usageCode: `import { Divider } from '@/designSystem';

export function Example() {
  return (
    <Divider label="Or continue with" />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {};

export const WithLabel: Story = {
  args: { label: 'Or continue with' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'stretch', height: 80, gap: 16 }}>
      <span>Left</span>
      <Divider {...args} />
      <span>Right</span>
    </div>
  ),
};
