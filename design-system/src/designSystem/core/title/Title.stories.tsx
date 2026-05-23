import type { Meta, StoryObj } from '@storybook/react';

import { Title } from './Title';
const meta: Meta<typeof Title> = {
  tags: ['autodocs'],
  title: 'Core/Title',
  component: Title,
    parameters: {
    docs: {
      description: { component: "**Title** is part of the Core catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Title component",
      guide: {
  "whenToUse": [
    "Use **Title** in core flows where this UI pattern is needed.",
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
      "description": "Baseline Title configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Title level={2}>Page title</Title>);`,
        usageCode: `import { Title } from '@/designSystem';

export function Example() {
  return (
    <Title level={2}>Page title</Title>
  );
}`,
  },
  args: {
    children: 'Patient overview',
    level: 2,
    weight: 'bold',
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Title>;

export const Default: Story = {};

export const Levels: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <Title key={level} level={level as 1 | 2 | 3 | 4 | 5 | 6}>
          Heading level {level}
        </Title>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
        <Title key={weight} weight={weight}>
          {weight} weight
        </Title>
      ))}
    </div>
  ),
};
