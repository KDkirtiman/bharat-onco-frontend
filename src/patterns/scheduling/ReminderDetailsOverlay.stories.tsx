import type { Meta, StoryObj } from '@storybook/react';
import { ReminderDetailsOverlay } from './ReminderDetailsOverlay';
import { mockAppointments, mockDoctors } from '../../datapoints/scheduling';
import { fixturePatient, fixtureVisitAlert } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof ReminderDetailsOverlay> = {
  title: 'Patterns/Scheduling/ReminderDetailsOverlay',
  component: ReminderDetailsOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['alert', 'patient', 'doctors', 'appointments'], 'Data'),
    ...hideArgs(['onSchedule', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof ReminderDetailsOverlay>;

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
