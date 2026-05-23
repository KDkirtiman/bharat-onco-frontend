import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { TextField } from './TextField';
const meta: Meta<typeof TextField> = {
  tags: ['autodocs'],
  title: 'Core/TextField',
  component: TextField,
    parameters: {
    docs: {
      description: { component: "Wraps `<input>` with label, helper text, error state, and optional adornments or clear button." },
      subtitle: "Single-line text input with label and validation UI",
      guide: {
  "whenToUse": [
    "Short text: names, email, search.",
    "Pair with `Label` or use built-in `label` prop."
  ],
  "capabilities": [
    "label",
    "error",
    "helperText",
    "startAdornment",
    "endAdornment",
    "clearable"
  ],
  "scenarios": [
    {
      "title": "Default",
      "story": "Default",
      "description": "Basic field."
    }
  ]
},
    },
    liveCode: `render(<TextField label="MRN / Employee ID" placeholder="Enter your MRN or Employee ID" />);`,
        usageCode: `import { TextField } from '@/designSystem';

export function Example() {
  return (
    <TextField label="MRN / Employee ID" placeholder="Enter your MRN or Employee ID" />
  );
}`,
  },
  args: {
    label: 'MRN / Employee ID',
    placeholder: 'Enter your MRN or Employee ID',
  },
  argTypes: {
    label: { description: "Visible field label." },
    error: { description: "Error message; sets aria-invalid." },
    helperText: { description: "Non-error hint below field." },
    clearable: { description: "Shows clear control when value present." },
    startAdornment: { description: "Prefix content (icon, currency)." },
    endAdornment: { description: "Suffix content." },
    disabled: { description: "Read-only interaction." },
    placeholder: { description: "Placeholder text." },
    value: { description: "Controlled value." },
    onChange: { description: "Change handler." },
  },
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: 'Use your hospital-issued MRN or staff Employee ID.',
  },
};

export const Error: Story = {
  args: {
    error: 'This field is required.',
  },
};

export const SearchField: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search by name or MRN…',
    startAdornment: '🔍',
  },
};

/** Controlled input — type here and watch the Actions panel for change events. */
export const Controlled: Story = {
  render: function ControlledTextField() {
    const [value, setValue] = useState('');
    return (
      <TextField
        label="Live search (controlled)"
        placeholder="Type anything…"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          action('onChange')(v);
        }}
      />
    );
  },
};

export const Clearable: Story = {
  render: function ClearableTextField() {
    const [value, setValue] = useState('Rajesh Kumar');
    return (
      <TextField
        label="Patient name"
        clearable
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /patient name/i });
    await expect(input).toHaveValue('Rajesh Kumar');
    await userEvent.click(canvas.getByRole('button', { name: /clear input/i }));
    await expect(input).toHaveValue('');
  },
};
