import type { Meta, StoryObj } from '@storybook/react';
import { Activity } from 'bfd-icons';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Controls/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: 'Primary Action', variant: 'primary' } };
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } };
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } };
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } };
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive', size: 'sm' } };
export const Loading: Story = { args: { children: 'Saving…', loading: true } };
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } };
export const Small: Story = { args: { children: 'Small', size: 'sm' } };
export const Large: Story = { args: { children: 'Large', size: 'lg' } };
