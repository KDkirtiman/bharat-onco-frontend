import type { Meta, StoryObj } from '@storybook/react';
import { RescheduleOverlay } from './RescheduleOverlay';
import { mockAppointments, mockDoctors } from 'bfd-core';
import { fixtureAppointment, fixturePatient } from '@storybook/fixtures';
import { hideArgs, overlayStoryParameters } from '@storybook/overlay-params';

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
