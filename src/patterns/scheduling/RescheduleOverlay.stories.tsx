import type { Meta, StoryObj } from '@storybook/react';
import { RescheduleOverlay } from './RescheduleOverlay';
import { mockAppointments, mockDoctors } from '../../datapoints/scheduling';
import { fixtureAppointment, fixturePatient } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof RescheduleOverlay> = {
  title: 'Patterns/Scheduling/RescheduleOverlay',
  component: RescheduleOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['appointment', 'patient', 'doctors', 'appointments'], 'Data'),
    ...hideArgs(['onSave', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof RescheduleOverlay>;

export const Default: Story = {
  args: {
    appointment: fixtureAppointment,
    patient: fixturePatient,
    doctors: mockDoctors,
    appointments: mockAppointments,
    onSave: () => {},
    onClose: () => {},
  },
};
