import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const StaffDesktop: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [center, setCenter] = useState('Kurukshetra');
  const [view, setView] = useState('dashboard');
    return (
      <div className="flex h-screen">
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          role="staff"
          isMobile={false}
          selectedCenter={center}
          onCenterChange={setCenter}
          activeView={view}
          onNavChange={setView}
        />
        <main className="flex-1 p-6 bg-background">Active view: {view}</main>
      </div>
    );
  },
};
