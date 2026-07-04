import type { Meta, StoryObj } from '@storybook/react';
import { ViewInvoiceOverlay } from './ViewInvoiceOverlay';
import {
  fixtureAppointment,
  fixtureDoctor,
  fixtureInvoice,
  fixturePatient,
} from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof ViewInvoiceOverlay> = {
  title: 'Patterns/Billing/ViewInvoiceOverlay',
  component: ViewInvoiceOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['invoice', 'appointment', 'patient', 'doctor'], 'Data'),
    ...hideArgs(['onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof ViewInvoiceOverlay>;

export const Default: Story = {
  args: {
    invoice: fixtureInvoice,
    appointment: fixtureAppointment,
    patient: fixturePatient,
    doctor: fixtureDoctor,
    onClose: () => {},
  },
};
