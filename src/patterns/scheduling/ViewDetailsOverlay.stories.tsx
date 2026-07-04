import type { Meta, StoryObj } from '@storybook/react';
import { ViewDetailsOverlay } from './ViewDetailsOverlay';
import { fixtureAppointment, fixtureDoctor, fixturePatient } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof ViewDetailsOverlay> = {
  title: 'Patterns/Scheduling/ViewDetailsOverlay',
  component: ViewDetailsOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['appointment', 'patient', 'doctor'], 'Data'),
    ...hideArgs(['onClose', 'onPrimaryAction'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof ViewDetailsOverlay>;

export const Default: Story = {
  args: {
    appointment: fixtureAppointment,
    patient: fixturePatient,
    doctor: fixtureDoctor,
    onClose: () => {},
    onPrimaryAction: () => {},
  },
};
