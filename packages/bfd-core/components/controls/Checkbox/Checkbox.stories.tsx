import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Controls/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { label: 'I agree to the terms' } };
export const Checked: Story = { args: { label: 'Pre-authorization obtained', defaultChecked: true } };
