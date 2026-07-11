import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Controls/TextField',
  component: TextField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = { args: { placeholder: 'Enter text…' } };
export const WithError: Story = { args: { placeholder: 'Enter text…', error: true } };
export const Date: Story = { args: { type: 'date' } };
