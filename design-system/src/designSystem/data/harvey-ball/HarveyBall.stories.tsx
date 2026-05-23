import type { Meta, StoryObj } from '@storybook/react';

import { HarveyBall } from './HarveyBall';
const meta: Meta<typeof HarveyBall> = {
  tags: ['autodocs'],
  title: 'Data/HarveyBall',
  component: HarveyBall,
    parameters: {
    docs: {
      description: { component: "**HarveyBall** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "HarveyBall component",
      guide: {
  "whenToUse": [
    "Use **HarveyBall** in data flows where this UI pattern is needed.",
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
      "description": "Baseline HarveyBall configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<HarveyBall value={75} label="Completion" />);`,
        usageCode: `import { HarveyBall } from '@/designSystem';

export function Example() {
  return (
    <HarveyBall value={75} label="Completion" />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof HarveyBall>;

export const Default: Story = {
  args: { value: 65, label: 'Treatment progress' },
};

export const Values: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <HarveyBall value={25} />
      <HarveyBall value={50} />
      <HarveyBall value={75} />
      <HarveyBall value={100} />
    </div>
  ),
};
