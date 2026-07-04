import type { Meta, StoryObj } from '@storybook/react';
import { PrescriptionViewerOverlay } from './PrescriptionViewerOverlay';
import {
  fixtureAppointment,
  fixtureClinicalVisit,
  fixturePatient,
  fixtureVitals,
} from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof PrescriptionViewerOverlay> = {
  title: 'Patterns/Clinical/PrescriptionViewerOverlay',
  component: PrescriptionViewerOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['patient', 'appointment', 'clinicalVisit', 'vitals'], 'Data'),
    ...hideArgs(['onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof PrescriptionViewerOverlay>;

export const Default: Story = {
  args: {
    patient: fixturePatient,
    appointment: fixtureAppointment,
    clinicalVisit: fixtureClinicalVisit,
    vitals: fixtureVitals,
    onClose: () => {},
  },
};
