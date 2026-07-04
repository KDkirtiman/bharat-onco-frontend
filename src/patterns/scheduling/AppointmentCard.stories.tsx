import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentCard } from './AppointmentCard';
import {
  fixtureAppointment,
  fixtureDoctor,
  fixtureInvoice,
  fixturePatient,
} from '../../stories/fixtures';

const meta: Meta<typeof AppointmentCard> = {
  title: 'Display/AppointmentCard',
  component: AppointmentCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppointmentCard>;

export const StaffView: Story = {
  args: {
    appointment: fixtureAppointment,
    patient: fixturePatient,
    doctor: fixtureDoctor,
    userRole: 'staff',
    onReschedule: () => {},
    onCancel: () => {},
    onViewDetails: () => {},
    onGenerateInvoice: () => {},
    onViewInvoice: () => {},
    onPatientClick: () => {},
    onPrimaryAction: () => {},
  },
};

export const WithInvoice: Story = {
  args: {
    ...StaffView.args,
    invoice: fixtureInvoice,
  },
};

export const Overdue: Story = {
  args: {
    ...StaffView.args,
    overdue: true,
  },
};
