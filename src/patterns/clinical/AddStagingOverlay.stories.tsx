import type { Meta, StoryObj } from '@storybook/react';
import { AddStagingOverlay } from './AddStagingOverlay';
import { mockTreatmentPlans } from '../../datapoints/treatment';
import { fixturePatient } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof AddStagingOverlay> = {
  title: 'Patterns/Clinical/AddStagingOverlay',
  component: AddStagingOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['plans'], 'Data'),
    ...hideArgs(['onSave', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof AddStagingOverlay>;

export const Default: Story = {
  args: {
    patientId: fixturePatient.id,
    defaultSite: 'breast',
    plans: mockTreatmentPlans.filter((p) => p.patientId === fixturePatient.id),
    onSave: () => {},
    onClose: () => {},
  },
};
