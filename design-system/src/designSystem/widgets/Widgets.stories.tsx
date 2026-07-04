import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../core/badge/Badge';

import { ActivityListItem } from './ActivityListItem';
import { MetricCard } from './MetricCard';

const meta: Meta = {
  title: 'Widgets/Dashboard',
};

export default meta;
type Story = StoryObj;

export const MetricsRow: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 16,
        maxWidth: 960,
      }}
    >
      <MetricCard title="Check-ins" value="18" footer="+2 vs last week" />
      <MetricCard title="Visits" value="42" footer="Today" />
      <MetricCard
        title="Revenue"
        value="₹12.4L"
        footer={<Badge tone="success">+12.5%</Badge>}
      />
      <MetricCard title="Pending bills" value="7" footer="Action required" />
    </div>
  ),
};

export const ActivityFeed: Story = {
  render: () => (
    <div
      style={{
        background: 'var(--ds-color-surface)',
        borderRadius: 16,
        padding: 20,
        boxShadow: 'var(--ds-shadow-card)',
        maxWidth: 520,
      }}
    >
      <ActivityListItem
        tone="success"
        title="Patient registered"
        meta="Anjali Singh • 10 mins ago"
      />
      <ActivityListItem
        tone="warning"
        title="Lab result pending review"
        meta="Dr. Mehta • 1 hour ago"
      />
      <ActivityListItem tone="default" title="Visit completed" meta="Front desk • 2 hours ago" />
    </div>
  ),
};
