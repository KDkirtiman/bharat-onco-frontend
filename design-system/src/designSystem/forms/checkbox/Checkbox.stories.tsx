import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { Checkbox } from './Checkbox';
const meta: Meta<typeof Checkbox> = {
  tags: ['autodocs'],
  title: 'Forms/Checkbox',
  component: Checkbox,
    parameters: {
    docs: {
      description: { component: "Checkbox for independent or grouped boolean options. Supports indeterminate state for “select all”." },
      subtitle: "Boolean choice with optional label",
      guide: {
  "whenToUse": [
    "Opt-in agreements.",
    "Multi-select lists.",
    "Indeterminate parent in trees."
  ],
  "capabilities": [
    "Controlled/uncontrolled",
    "indeterminate",
    "label slot",
    "sizes"
  ],
  "scenarios": []
},
    },
    liveCode: `render(<Checkbox label="Accept terms" defaultChecked />);`,
        usageCode: `import { Checkbox } from '@/designSystem';

export function Example() {
  return (
    <Checkbox label="Accept terms" defaultChecked />
  );
}`,
  },
  args: {
    label: 'Accept terms and conditions',
    onCheckedChange: action('onCheckedChange'),
  },
  argTypes: {
    checked: { description: "Controlled checked state." },
    defaultChecked: { description: "Initial checked (uncontrolled)." },
    indeterminate: { description: "Partial selection visual." },
    label: { description: "Text beside the control." },
    disabled: { description: "Disables input." },
    onCheckedChange: { description: "Called with boolean when toggled." },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Select all patients',
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
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label={`Notifications ${checked ? 'on' : 'off'}`}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};
