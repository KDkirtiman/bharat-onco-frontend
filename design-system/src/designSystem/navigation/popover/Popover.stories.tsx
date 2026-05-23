import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, screen } from 'storybook/test';

import { Button } from '../../core/button/Button';
import { Popover } from './Popover';
const meta: Meta<typeof Popover> = {
  tags: ['autodocs'],
  title: 'Navigation/Popover',
  component: Popover,
    parameters: {
    docs: {
      description: { component: "**Popover** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Popover component",
      guide: {
  "whenToUse": [
    "Use **Popover** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline Popover configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <Popover trigger={<Button variant="secondary">Open</Button>}><Text>Popover content</Text></Popover>
);`,
        usageCode: `import { Button, Popover, Text } from '@/designSystem';

export function Example() {
  return (
    <Popover trigger={<Button variant="secondary">Open</Button>}><Text>Popover content</Text></Popover>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover trigger={<Button variant="secondary">More info</Button>}>
      <p>Additional context about this patient record.</p>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /more info/i }));
    const dialog = await screen.findByRole('dialog');
    await expect(dialog).toHaveTextContent(/additional context/i);
    await userEvent.keyboard('{Escape}');
    await expect(screen.queryByRole('dialog')).toBeNull();
  },
};
