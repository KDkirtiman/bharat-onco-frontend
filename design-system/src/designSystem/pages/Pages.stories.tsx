import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { Button } from '../core/button/Button';
import { Card } from '../core/card/Card';
import { Icon } from '../icons/Icon';
import { Logo } from '../icons/Logo';
import { Sidebar } from '../navigation/Sidebar';
import { ActivityListItem } from '../widgets/ActivityListItem';
import { MetricCard } from '../widgets/MetricCard';

import shellStyles from './appShell.module.css';
import { PatientListDemo } from './PatientListDemo';
const meta: Meta = {
  title: 'Pages/Compositions',
  parameters: {
    liveCode: `render(<PatientListDemo />);`,
    usageCode: `import { PatientListDemo } from '@/designSystem';

export function Example() {
  return <PatientListDemo />;
}`,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full layouts built from design-system pieces — closer to the real app than isolated atoms. Use **Interactions** panel to step through `play` functions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const clinicianNav = [
  { id: 'dash', label: 'Dashboard', icon: 'layoutDashboard' as const },
  { id: 'calendar', label: 'Visit Calendar', icon: 'calendar' as const },
  { id: 'patients', label: 'Patients', icon: 'users' as const },
  { id: 'profile', label: 'Profile', icon: 'user' as const },
];

function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ padding: 24, color: 'var(--ds-color-muted)' }}>
      <p style={{ margin: 0, fontWeight: 800, color: 'var(--ds-color-text)' }}>{title}</p>
      <p style={{ marginTop: 8 }}>
        Stub route — wire your router + data here. This story only proves shell navigation state.
      </p>
    </div>
  );
}

/**
 * Sidebar + main region + patient table with real React state (same as Tables → Patient list).
 */
export const PatientsFullAppShell: Story = {
  render: function PatientsShell() {
    const [route, setRoute] = useState<'dash' | 'calendar' | 'patients' | 'profile'>('patients');

    return (
      <div className={shellStyles.shell}>
        <Sidebar
          brandSlot={<Logo size="lg" />}
          items={clinicianNav}
          activeId={route}
          onSelect={(id) => {
            action('navigate')(id);
            setRoute(id as typeof route);
          }}
          footer={
            <Button variant="ghost" size="sm" fullWidth onClick={() => action('logout')()}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icon name="logout" size="sm" /> Logout
              </span>
            </Button>
          }
        />
        <main className={shellStyles.main}>
          <div className={shellStyles.mainInner}>
            {route === 'patients' ? (
              <PatientListDemo subtitle="Design-system composition — sidebar + patient list share one React tree." />
            ) : route === 'dash' ? (
              <Placeholder title="Dashboard" />
            ) : route === 'calendar' ? (
              <Placeholder title="Visit Calendar" />
            ) : (
              <Placeholder title="Profile" />
            )}
          </div>
        </main>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Navigate to Patients shows table', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /patients/i }));
      await expect(canvas.getByRole('heading', { name: 'Patients' })).toBeVisible();
    });

    await step('Search narrows rows', async () => {
      const input = canvas.getByTestId('patients-search');
      await userEvent.clear(input);
      await userEvent.type(input, 'Rajesh');
      await expect(canvas.getByText('Rajesh Kumar')).toBeVisible();
    });

    await step('Filters toggle shows panel', async () => {
      await userEvent.click(canvas.getByTestId('patients-filters-toggle'));
      await expect(canvas.getByTestId('patients-filters-panel')).toBeVisible();
    });
  },
};

/**
 * Staff dashboard pattern from mocks: metrics + activity + quick actions (no sidebar).
 */
export const StaffDashboardPage: Story = {
  render: () => (
    <div className={shellStyles.main} style={{ minHeight: '100vh' }}>
      <div className={shellStyles.mainInner}>
        <header className={shellStyles.dashboardHeader}>
          <div>
            <div>
              <Logo size="lg" />
              <p className={shellStyles.dashboardMeta} style={{ marginTop: 8 }}>
                Staff Dashboard · Staff Member
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => action('logout')()}>
            Logout
          </Button>
        </header>

        <div className={shellStyles.metricGrid}>
          <MetricCard title="Check-ins" value="18" footer="+2 vs last week" />
          <MetricCard title="Visits" value="42" footer="Today" />
          <MetricCard title="Pending" value="7" footer="Follow-ups" />
          <MetricCard title="Registered" value="12" footer="This week" />
        </div>

        <div className={shellStyles.bottomGrid}>
          <Card padding="md">
            <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Recent Activities</h2>
            <ActivityListItem
              tone="success"
              title="Patient registered"
              meta="Anjali Singh · 10 mins ago"
            />
            <ActivityListItem
              tone="warning"
              title="Lab result pending review"
              meta="Dr. Mehta · 1 hour ago"
            />
            <ActivityListItem tone="default" title="Visit completed" meta="Front desk · 2 hours ago" />
          </Card>
          <Card padding="md">
            <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button fullWidth>Patient Check-In</Button>
              <Button variant="secondary" fullWidth>
                Schedule Visit
              </Button>
              <Button variant="secondary" fullWidth>
                Process Payment
              </Button>
              <Button variant="secondary" fullWidth>
                Register New Patient
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Primary quick action is clickable', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /patient check-in/i }));
    });
  },
};
