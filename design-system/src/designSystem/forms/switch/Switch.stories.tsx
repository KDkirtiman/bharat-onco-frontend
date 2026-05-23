import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';

import { Switch } from './Switch';
const meta: Meta<typeof Switch> = {
  tags: ['autodocs'],
  title: 'Forms/Switch',
  component: Switch,
    parameters: {
    docs: {
      description: { component: "**Switch** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Switch component",
      guide: {
  "whenToUse": [
    "Use **Switch** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline Switch configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Switch label="Enable notifications" defaultChecked />);`,
        usageCode: `import { Switch } from '@/designSystem';

export function Example() {
  return (
    <Switch label="Enable notifications" defaultChecked />
  );
}`,
  },
  args: {
    label: 'Enable appointment reminders',
    onCheckedChange: action('onCheckedChange'),
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Controlled: Story = {
  render: function ControlledSwitch() {
    const [checked, setChecked] = useState(true);
    return (
      <Switch
        label={checked ? 'Reminders enabled' : 'Reminders disabled'}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};
