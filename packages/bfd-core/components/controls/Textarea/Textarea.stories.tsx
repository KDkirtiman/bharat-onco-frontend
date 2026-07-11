import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Controls/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { rows: 3, placeholder: 'Enter notes…' } };
export const WithError: Story = { args: { rows: 3, error: true, placeholder: 'Required field' } };
