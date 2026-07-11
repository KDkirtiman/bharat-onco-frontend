import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'bfd-icons';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Controls/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter patient name…' } };
export const WithIcon: Story = { args: { placeholder: 'Search…', icon: <Search size={16} /> } };
export const WithError: Story = { args: { placeholder: 'MRN', error: 'MRN is required' } };
export const Password: Story = { args: { type: 'password', placeholder: 'Password' } };
