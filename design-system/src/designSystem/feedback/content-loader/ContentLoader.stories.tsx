import type { Meta, StoryObj } from '@storybook/react';

import { ContentLoader } from './ContentLoader';
const meta: Meta<typeof ContentLoader> = {
  tags: ['autodocs'],
  title: 'Feedback/ContentLoader',
  component: ContentLoader,
    parameters: {
    docs: {
      description: { component: "**ContentLoader** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "ContentLoader component",
      guide: {
  "whenToUse": [
    "Use **ContentLoader** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline ContentLoader configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<ContentLoader lines={3} />);`,
        usageCode: `import { ContentLoader } from '@/designSystem';

export function Example() {
  return (
    <ContentLoader lines={3} />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof ContentLoader>;

export const Text: Story = {
  args: { lines: 4 },
};

export const Card: Story = {
  args: { variant: 'card' },
};

export const Avatar: Story = {
  args: { variant: 'avatar' },
};
