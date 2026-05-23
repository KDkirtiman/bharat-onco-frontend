import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Rate } from './Rate';
const meta: Meta<typeof Rate> = {
  tags: ['autodocs'],
  title: 'Data/Rate',
  component: Rate,
    parameters: {
    docs: {
      description: { component: "**Rate** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Rate component",
      guide: {
  "whenToUse": [
    "Use **Rate** in data flows where this UI pattern is needed.",
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
      "description": "Baseline Rate configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Rate defaultValue={3} />);`,
        usageCode: `import { Rate } from '@/designSystem';

export function Example() {
  return (
    <Rate defaultValue={3} />
  );
}`,
  },
  args: { onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Rate>;

export const Default: Story = {
  args: { defaultValue: 3 },
};

export const ReadOnly: Story = {
  args: { value: 4, readOnly: true },
};
