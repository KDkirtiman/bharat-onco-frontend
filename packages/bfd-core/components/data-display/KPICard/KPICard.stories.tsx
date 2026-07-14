import type { Meta, StoryObj } from '@storybook/react';
import { Users, Calendar, TrendingUp } from 'bfd-icons';
import { KPICard } from './KPICard';

const meta: Meta<typeof KPICard> = {
  title: 'DataDisplay/KPICard',
  component: KPICard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const Default: Story = {
  args: {
    title: 'Today\'s Appointments',
    value: '24',
    subtitle: 'Kurukshetra center',
    icon: <Calendar className="text-primary" size={20} />,
    trend: 'up',
    trendValue: '+12%',
    sparklineData: [12, 18, 15, 22, 24, 20, 24],
  },
};

export const Neutral: Story = {
  args: {
    title: 'Active Patients',
    value: '156',
    icon: <Users className="text-secondary" size={20} />,
    trend: 'neutral',
    trendValue: '0%',
  },
};

export const Down: Story = {
  args: {
    title: 'Pending Invoices',
    value: '8',
    icon: <TrendingUp className="text-destructive" size={20} />,
    trend: 'down',
    trendValue: '-3',
  },
};
