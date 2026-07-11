import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Feedback/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Scheduled: Story = { args: { status: 'scheduled' } };
export const Confirmed: Story = { args: { status: 'confirmed' } };
export const CheckedIn: Story = { args: { status: 'checked-in' } };
export const InProgress: Story = { args: { status: 'in-progress' } };
export const Completed: Story = { args: { status: 'completed' } };
export const Cancelled: Story = { args: { status: 'cancelled' } };
export const VitalsRecorded: Story = { args: { status: 'vitals-recorded' } };
