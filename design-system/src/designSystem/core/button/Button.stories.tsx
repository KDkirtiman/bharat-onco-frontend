import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { Button } from './Button';
const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    liveCode: `render(<Button variant="primary">Sign in</Button>);`,
        usageCode: `import { Button } from '@/designSystem';

export function Example() {
  return (
    <Button variant="primary">Sign in</Button>
  );
}`,
    docs: {
      description: {
        component:
          'Standard button for actions (submit, confirm, navigate). Variants control visual hierarchy; `loading` disables interaction and shows a spinner. For icon-only toolbars use **Button2**.',
      },
      subtitle: 'Primary call-to-action control',
      guide: {
        whenToUse: [
          'Primary actions: submit forms, confirm dialogs.',
          'Secondary actions: `variant="secondary"` or `ghost`.',
          'Destructive flows: `variant="danger"`.',
        ],
        capabilities: [
          'Variants: primary, secondary, ghost, danger',
          'Sizes: sm, md, lg',
          'loading state with spinner',
          'startIcon / endIcon slots',
          'fullWidth for mobile forms',
        ],
        scenarios: [
          { title: 'Primary CTA', description: 'Default sign-in / submit.', story: 'Primary' },
          { title: 'Loading', description: 'Async submit.', story: 'Loading' },
          { title: 'Full width', description: 'Mobile forms.', story: 'FullWidth' },
          { title: 'Interactive', description: 'Click counter.', story: 'Interactive' },
        ],
      },
    },
  },
  args: {
    children: 'Sign In',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: { description: '`primary` | `secondary` | `ghost` | `danger`.' },
    size: { description: '`sm` | `md` | `lg`.' },
    loading: { description: 'Disables button and shows spinner.' },
    fullWidth: { description: 'Stretches to container width.' },
    startIcon: { description: 'Node before label text.' },
    endIcon: { description: 'Node after label text.' },
    disabled: { description: 'Prevents interaction.' },
    onClick: { description: 'Click handler.' },
    children: { description: 'Button label.' },
    className: { description: 'Additional CSS classes.' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
  },
};

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
  args: { fullWidth: true, children: 'Register New Patient', size: 'sm' },
  parameters: { viewport: { defaultViewport: 'mobile' } },
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
    );
  },
};
