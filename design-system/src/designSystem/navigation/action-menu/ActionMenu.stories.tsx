import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Button } from '../../core/button/Button';
import { Icon } from '../../icons/Icon';

import { ActionMenu } from './ActionMenu';
const meta: Meta<typeof ActionMenu> = {
  tags: ['autodocs'],
  title: 'Navigation/ActionMenu',
  component: ActionMenu,
    parameters: {
    docs: {
      description: { component: "**ActionMenu** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "ActionMenu component",
      guide: {
  "whenToUse": [
    "Use **ActionMenu** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline ActionMenu configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <ActionMenu label="Actions" items={[{ label: 'Edit', onSelect: () => {} }, { label: 'Delete', onSelect: () => {} }]} />
);`,
        usageCode: `import { ActionMenu } from '@/designSystem';

export function Example() {
  return (
    <ActionMenu label="Actions" items={[{ label: 'Edit', onSelect: () => {} }, { label: 'Delete', onSelect: () => {} }]} />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof ActionMenu>;

const items = [
  { id: 'edit', label: 'Edit record', icon: <Icon name="user" size="sm" /> },
  { id: 'archive', label: 'Archive', icon: <Icon name="calendar" size="sm" /> },
  { id: 'delete', label: 'Delete', destructive: true, icon: <Icon name="logout" size="sm" /> },
];

export const Default: Story = {
  render: () => (
    <ActionMenu
      trigger={<Button variant="secondary">Actions</Button>}
      items={items}
      onSelect={action('select')}
    />
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ActionMenu
        trigger={<Button variant="ghost">More</Button>}
        items={items}
        align="end"
        onSelect={action('select')}
      />
    </div>
  ),
};
