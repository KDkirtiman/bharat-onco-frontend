import type { Meta, StoryObj } from '@storybook/react';
import { ChairAssignmentOverlay } from './ChairAssignmentOverlay';
import { mockChairs } from '../../datapoints/chairs';
import { fixtureAppointment, fixturePatient } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof ChairAssignmentOverlay> = {
  title: 'Patterns/Scheduling/ChairAssignmentOverlay',
  component: ChairAssignmentOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['appointment', 'patient', 'chairs'], 'Data'),
    ...hideArgs(['onAssign', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof ChairAssignmentOverlay>;

export const Default: Story = {
  args: {
    appointment: fixtureAppointment,
    patient: fixturePatient,
    selectedCenter: 'Kurukshetra',
    chairs: mockChairs,
    onAssign: () => {},
    onClose: () => {},
  },
};
