import type { Meta, StoryObj } from '@storybook/react';
import { OncologistReferencePanel } from './OncologistReferencePanel';
import { mockAppointments } from '../../datapoints/scheduling';
import { mockClinicalVisits } from '../../datapoints/clinical';
import { mockTreatmentPlans, mockTreatmentDelivery, mockToxicityRecords } from '../../datapoints/treatment';
import { mockStagingRecords } from '../../datapoints/staging';
import { fixturePatient } from '../../stories/fixtures';

const meta: Meta<typeof OncologistReferencePanel> = {
  title: 'Patterns/Clinical/OncologistReferencePanel',
  component: OncologistReferencePanel,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OncologistReferencePanel>;

export const Default: Story = {
  args: {
    patient: fixturePatient,
    appointments: mockAppointments,
    clinicalVisits: mockClinicalVisits,
    treatmentPlans: mockTreatmentPlans,
    treatmentDelivery: mockTreatmentDelivery,
    toxicityRecords: mockToxicityRecords,
    stagingRecords: mockStagingRecords,
    currentAppointmentId: mockAppointments[0]?.id ?? 'a1',
    onClose: () => {},
  },
};
