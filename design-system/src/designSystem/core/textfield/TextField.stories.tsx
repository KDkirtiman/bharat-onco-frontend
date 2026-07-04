import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';

import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Core/TextField',
  component: TextField,
  args: {
    label: 'MRN / Employee ID',
    placeholder: 'Enter your MRN or Employee ID',
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

