import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within, screen } from 'storybook/test';

import { Button } from '../../core/button/Button';
import { Menu } from './Menu';
const items = [
  { id: 'view', label: 'View details' },
  { id: 'edit', label: 'Edit record' },
  { id: 'delete', label: 'Delete', destructive: true },
];

const meta: Meta<typeof Menu> = {
  tags: ['autodocs'],
  title: 'Navigation/Menu',
  component: Menu,
    parameters: {
    docs: {
      description: { component: "**Menu** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Menu component",
      guide: {
  "whenToUse": [
    "Use **Menu** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline Menu configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Menu trigger={<Button variant="secondary">Menu</Button>} items={[{ label: 'Profile' }, { label: 'Logout' }]} />);`,
        usageCode: `import { Button, Menu } from '@/designSystem';

export function Example() {
  return (
    <Menu trigger={<Button variant="secondary">Menu</Button>} items={[{ label: 'Profile' }, { label: 'Logout' }]} />
  );
}`,
  },
  args: { items, onSelect: action('onSelect') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: (args) => <Menu {...args} trigger={<Button variant="secondary">Actions</Button>} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /actions/i }));
    await userEvent.click(await screen.findByRole('menuitem', { name: /edit record/i }));
    await expect(screen.queryByRole('menuitem', { name: /edit record/i })).toBeNull();
  },
};
