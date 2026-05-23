import type { Meta, StoryObj } from '@storybook/react';

import { Playground } from './Playground';

const meta: Meta<typeof Playground> = {
  tags: ['autodocs'],
  title: 'Playground/Composition',
  component: Playground,
    parameters: {
    docs: {
      description: { component: "**Playground** is part of the Playground catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Playground component",
      guide: {
  "whenToUse": [
    "Use **Playground** in playground flows where this UI pattern is needed.",
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
      "description": "Baseline Playground configuration.",
      "story": "Default"
    }
  ]
},
    },
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;

type Story = StoryObj<typeof Playground>;

export const LiveEditor: Story = {};
