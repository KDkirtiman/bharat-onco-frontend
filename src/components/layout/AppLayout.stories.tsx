import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './AppLayout';
import { fixtureUser } from '../../stories/fixtures';
import { mockPatients } from '../../datapoints/patients';

const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const StaffDashboard: Story = {
  args: {
    user: fixtureUser,
    selectedCenter: 'Kurukshetra',
    onCenterChange: () => {},
    onLogout: () => {},
    patients: mockPatients,
    activeView: 'dashboard',
    onViewChange: () => {},
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Content</h1>
        <p className="text-muted-foreground mt-2">App shell with header + sidebar.</p>
      </div>
    ),
  },
};
