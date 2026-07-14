import type { Meta, StoryObj } from '@storybook/react';
import { X } from 'bfd-icons';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Controls/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: { icon: <X size={18} />, label: 'Close' },
};

export const Small: Story = {
  args: { icon: <X size={14} />, label: 'Close', size: 'sm' },
};
