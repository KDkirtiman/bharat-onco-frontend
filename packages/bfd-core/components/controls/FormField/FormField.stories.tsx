import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { TextField } from '../TextField';
import { Select } from '../Select';
import { Textarea } from '../Textarea';

const meta: Meta<typeof FormField> = {
  title: 'Controls/FormField',
  component: FormField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <FormField label="Email" required error="Invalid email">
      <TextField type="email" placeholder="you@example.com" error />
    </FormField>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <FormField label="Visit Type" required>
      <Select
        placeholder="Select type"
        options={[
          { value: 'follow-up', label: 'Follow-up' },
          { value: 'chemo-session', label: 'Chemo Session' },
        ]}
      />
    </FormField>
  ),
};

export const Uppercase: Story = {
  render: () => (
    <FormField label="Cancer Site" required labelVariant="uppercase">
      <Select placeholder="Select site" options={[{ value: 'breast', label: 'Breast' }]} />
    </FormField>
  ),
};

export const OptionalTextarea: Story = {
  render: () => (
    <FormField label="Notes" optional>
      <Textarea rows={3} placeholder="Optional notes…" />
    </FormField>
  ),
};
