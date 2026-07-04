import type { Meta, StoryObj } from '@storybook/react';
import { OverviewTab } from './OverviewTab';
import { fixturePatient } from '../../stories/fixtures';
import { mockTreatmentPlans } from '../../datapoints/treatment';

const meta: Meta<typeof OverviewTab> = {
  title: 'Patient/OverviewTab',
  component: OverviewTab,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OverviewTab>;

export const Default: Story = {
  args: {
    patient: fixturePatient,
    treatmentPlans: mockTreatmentPlans.filter(p => p.patientId === fixturePatient.id),
  },
};
