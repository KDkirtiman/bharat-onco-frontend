import type { Meta, StoryObj } from '@storybook/react';
import { QuickScheduleOverlay } from './QuickScheduleOverlay';
import { mockAppointments, mockDoctors } from 'bfd-core';
import { fixturePatient, fixtureVisitAlert } from '@storybook/fixtures';
import { hideArgs, overlayStoryParameters } from '@storybook/overlay-params';

const meta: Meta<typeof QuickScheduleOverlay> = {
  title: 'Patterns/Scheduling/QuickScheduleOverlay',
  component: QuickScheduleOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['alert', 'patient', 'doctors', 'appointments'], 'Data'),
    ...hideArgs(['onSchedule', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof QuickScheduleOverlay>;

export const Default: Story = {
  args: {
    alert: fixtureVisitAlert,
    patient: fixturePatient,
    doctors: mockDoctors,
    appointments: mockAppointments,
    selectedCenter: 'Kurukshetra',
    onSchedule: () => {},
    onClose: () => {},
  },
};
