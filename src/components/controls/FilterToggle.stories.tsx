import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterToggle } from './FilterToggle';

const meta: Meta<typeof FilterToggle> = {
  title: 'Controls/FilterToggle',
  component: FilterToggle,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterToggle<string>>;

export const DateFilter: Story = {
  render: () => {
    const [value, setValue] = useState('mtd');
    return (
      <FilterToggle
        value={value}
        onChange={setValue}
        options={[
          { value: 'today', label: 'Today' },
          { value: 'mtd', label: 'Month to Date' },
          { value: 'overall', label: 'Overall' },
        ]}
      />
    );
  },
};

export const BillingPeriod: Story = {
  render: () => {
    const [value, setValue] = useState('month');
    return (
      <FilterToggle
        value={value}
        onChange={setValue}
        options={[
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
          { value: 'q1', label: 'Q1' },
          { value: 'q2', label: 'Q2' },
        ]}
      />
    );
  },
};
