import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { CardButton } from './CardButton';
const meta: Meta<typeof CardButton> = {
  tags: ['autodocs'],
  title: 'Data/CardButton',
  component: CardButton,
    parameters: {
    docs: {
      description: { component: "**CardButton** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "CardButton component",
      guide: {
  "whenToUse": [
    "Use **CardButton** in data flows where this UI pattern is needed.",
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
      "description": "Baseline CardButton configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<CardButton selected title="POU_Westan.pdf" description="PDF · 2MB" />);`,
        usageCode: `import { CardButton } from '@/designSystem';

export function Example() {
  return (
    <CardButton selected title="POU_Westan.pdf" description="PDF · 2MB" />
  );
}`,
  },
  args: { onSelectedChange: action('onSelectedChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof CardButton>;

export const Default: Story = {
  args: {
    title: 'Chemotherapy',
    description: 'Systemic treatment option',
  },
};

export const Selected: Story = {
  args: {
    title: 'Radiation therapy',
    description: 'Localized treatment',
    defaultSelected: true,
  },
};
