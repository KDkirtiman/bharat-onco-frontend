import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'DataDisplay/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Small: Story = { args: { name: 'Jane Doe', size: 'sm' } };
export const Medium: Story = { args: { name: 'Jane Doe', size: 'md' } };
export const Large: Story = { args: { name: 'Jane Doe', size: 'lg' } };
