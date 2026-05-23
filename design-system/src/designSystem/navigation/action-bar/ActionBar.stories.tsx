import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Button } from '../../core/button/Button';
import { Button2 } from '../../core/button2/Button2';
import { Icon } from '../../icons/Icon';

import { ActionBar } from './ActionBar';
import { ActionBarMenuButton } from '../action-bar-menu-button/ActionBarMenuButton';
const meta: Meta<typeof ActionBar> = {
  tags: ['autodocs'],
  title: 'Navigation/ActionBar',
  component: ActionBar,
    parameters: {
    docs: {
      description: { component: "**ActionBar** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "ActionBar component",
      guide: {
  "whenToUse": [
    "Use **ActionBar** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline ActionBar configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <ActionBar><Button size="sm">Save</Button><Button size="sm" variant="secondary">Cancel</Button></ActionBar>
);`,
        usageCode: `import { ActionBar, Button } from '@/designSystem';

export function Example() {
  return (
    <ActionBar><Button size="sm">Save</Button><Button size="sm" variant="secondary">Cancel</Button></ActionBar>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof ActionBar>;

const overflowItems = [
  { id: 'export', label: 'Export' },
  { id: 'print', label: 'Print' },
  { id: 'delete', label: 'Delete selected', destructive: true },
];

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: 240 }}>
      <ActionBar>
        <Button2 icon={<Icon name="search" size="md" />} label="Search" onClick={action('search')} />
        <Button variant="secondary" size="sm">
          Filter
        </Button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm">
            Add patient
          </Button>
          <ActionBarMenuButton items={overflowItems} onSelect={action('overflow')} />
        </div>
      </ActionBar>
      <p style={{ padding: 16, color: 'var(--ds-color-muted)' }}>
        Scroll context — the action bar sticks to the top when sticky is enabled.
      </p>
    </div>
  ),
};
