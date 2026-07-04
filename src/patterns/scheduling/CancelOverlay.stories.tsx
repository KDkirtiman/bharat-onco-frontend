import type { Meta, StoryObj } from '@storybook/react';
import { CancelOverlay } from './CancelOverlay';
import { fixtureAppointment, fixtureDoctor, fixturePatient } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof CancelOverlay> = {
  title: 'Patterns/Scheduling/CancelOverlay',
  component: CancelOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['appointment', 'patient', 'doctor'], 'Data'),
    ...hideArgs(['onConfirm', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof CancelOverlay>;

export const Default: Story = {
  args: {
    appointment: fixtureAppointment,
    patient: fixturePatient,
    doctor: fixtureDoctor,
    onConfirm: () => {},
    onClose: () => {},
  },
};
