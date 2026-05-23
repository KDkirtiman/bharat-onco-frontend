import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Slider } from './Slider';
const meta: Meta<typeof Slider> = {
  tags: ['autodocs'],
  title: 'Data/Slider',
  component: Slider,
    parameters: {
    docs: {
      description: { component: "**Slider** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Slider component",
      guide: {
  "whenToUse": [
    "Use **Slider** in data flows where this UI pattern is needed.",
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
      "description": "Baseline Slider configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Slider label="Volume" defaultValue={40} />);`,
        usageCode: `import { Slider } from '@/designSystem';

export function Example() {
  return (
    <Slider label="Volume" defaultValue={40} />
  );
}`,
  },
  args: { onValueChange: action('onValueChange'), label: 'Pain level', showValue: true },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: 40, min: 0, max: 10 },
};

export const Disabled: Story = {
  args: { defaultValue: 5, disabled: true },
};
