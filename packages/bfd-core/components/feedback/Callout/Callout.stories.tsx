import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle } from 'bfd-icons';
import { Callout } from './Callout';

const meta: Meta<typeof Callout> = {
  title: 'Feedback/Callout',
  component: Callout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Warning: Story = {
  args: {
    variant: 'warning',
    icon: <AlertTriangle size={18} />,
    title: 'You are about to cancel:',
    children: 'Jane Doe · 10:30 AM',
    subtitle: 'Follow-up · Dr. Sharma',
  },
};

export const Info: Story = { args: { variant: 'info', title: 'Information', children: 'Additional context here.' } };
export const Success: Story = { args: { variant: 'success', title: 'Saved', children: 'Changes saved successfully.' } };
export const Destructive: Story = { args: { variant: 'destructive', title: 'Error', children: 'Something went wrong.' } };
