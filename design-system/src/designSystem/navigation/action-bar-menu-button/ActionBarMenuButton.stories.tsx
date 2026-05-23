import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { ActionBarMenuButton } from './ActionBarMenuButton';
const meta: Meta<typeof ActionBarMenuButton> = {
  tags: ['autodocs'],
  title: 'Navigation/ActionBarMenuButton',
  component: ActionBarMenuButton,
    parameters: {
    docs: {
      description: { component: "**ActionBarMenuButton** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "ActionBarMenuButton component",
      guide: {
  "whenToUse": [
    "Use **ActionBarMenuButton** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline ActionBarMenuButton configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <ActionBar>
    <Button size="sm">Primary</Button>
    <ActionBarMenuButton items={[{ label: 'More', onSelect: () => {} }]} />
  </ActionBar>
);`,
        usageCode: `import { ActionBar, ActionBarMenuButton, Button } from '@/designSystem';

export function Example() {
  return (
    <ActionBar>
        <Button size="sm">Primary</Button>
        <ActionBarMenuButton items={[{ label: 'More', onSelect: () => {} }]} />
      </ActionBar>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof ActionBarMenuButton>;

export const Default: Story = {
  args: {
    items: [
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'archive', label: 'Archive' },
      { id: 'remove', label: 'Remove', destructive: true },
    ],
    onSelect: action('select'),
  },
};
