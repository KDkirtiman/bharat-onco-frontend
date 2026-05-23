import type { Meta, StoryObj } from '@storybook/react';

import { Countdown } from './Countdown';
const meta: Meta<typeof Countdown> = {
  tags: ['autodocs'],
  title: 'Forms/Countdown',
  component: Countdown,
    parameters: {
    docs: {
      description: { component: "**Countdown** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Countdown component",
      guide: {
  "whenToUse": [
    "Use **Countdown** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline Countdown configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Countdown targetDate={new Date(Date.now() + 86400000)} />);`,
        usageCode: `import { Countdown } from '@/designSystem';

export function Example() {
  return (
    <Countdown targetDate={new Date(Date.now() + 86400000)} />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Countdown>;

export const Default: Story = {
  args: {
    label: 'Next appointment',
    targetDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
};
