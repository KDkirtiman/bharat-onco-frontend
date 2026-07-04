import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  args: {
    children: 'Sign In',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Text Action' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Processing…' },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Register New Patient',
    size: "sm"
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Button {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveButton() {
    const [count, setCount] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <Button
          onClick={() => {
            setCount((c) => {
              const next = c + 1;
              action('click')(next);
              return next;
            });
          }}
        >
          Clicked {count} times
        </Button>
        <span style={{ fontSize: 12, color: 'var(--ds-color-muted)' }}>
          Opens the Actions panel (addon-actions) on each click.
        </span>
      </div>
    );
  },
};

