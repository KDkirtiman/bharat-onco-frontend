import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { Tooltip } from './Tooltip';
const meta: Meta<typeof Tooltip> = {
  tags: ['autodocs'],
  title: 'Feedback/Tooltip',
  component: Tooltip,
    parameters: {
    docs: {
      description: { component: "**Tooltip** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Tooltip component",
      guide: {
  "whenToUse": [
    "Use **Tooltip** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline Tooltip configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <Tooltip content="Help text"><Button variant="secondary">Hover me</Button></Tooltip>
);`,
        usageCode: `import { Button, Tooltip } from '@/designSystem';

export function Example() {
  return (
    <Tooltip content="Help text"><Button variant="secondary">Hover me</Button></Tooltip>
  );
}`,
  },
  args: {
    content: 'Helpful context about this action.',
    placement: 'top',
    delay: 300,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">Hover or focus me</Button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 48,
        padding: 80,
        justifyItems: 'center',
      }}
    >
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip key={placement} content={`${placement} tooltip`} placement={placement}>
          <Button variant="ghost">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
