import type { Meta, StoryObj } from '@storybook/react';
import { BookAppointmentOverlay } from './BookAppointmentOverlay';
import { mockAppointments } from '../../datapoints/scheduling';
import { fixturePatients } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof BookAppointmentOverlay> = {
  title: 'Patterns/Scheduling/BookAppointmentOverlay',
  component: BookAppointmentOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['patients', 'appointments'], 'Data'),
    ...hideArgs(['onBook', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof BookAppointmentOverlay>;

export const Default: Story = {
  args: {
    patients: fixturePatients,
    appointments: mockAppointments,
    selectedCenter: 'Kurukshetra',
    onBook: () => {},
    onClose: () => {},
  },
};
