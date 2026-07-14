import type { Meta, StoryObj } from '@storybook/react';
import { VisitAlertsCard } from './VisitAlertsCard';
import { mockVisitAlerts } from 'bfd-core';
import { mockPatients } from 'bfd-core';

const meta: Meta<typeof VisitAlertsCard> = {
  title: 'Patterns/Scheduling/VisitAlertsCard',
  component: VisitAlertsCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VisitAlertsCard>;

export const Default: Story = {
  args: {
    alerts: mockVisitAlerts.slice(0, 5),
    patients: mockPatients,
    onSchedule: () => {},
    onSendReminder: () => {},
    onViewDetails: () => {},
  },
};
