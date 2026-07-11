import type { Meta, StoryObj } from '@storybook/react';
import { SendReminderOverlay } from './SendReminderOverlay';
import { fixturePatient, fixtureVisitAlert } from '@storybook/fixtures';
import { hideArgs, overlayStoryParameters } from '@storybook/overlay-params';

const meta: Meta<typeof SendReminderOverlay> = {
  title: 'Patterns/Scheduling/SendReminderOverlay',
  component: SendReminderOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['alert', 'patient'], 'Data'),
    ...hideArgs(['onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof SendReminderOverlay>;

export const Default: Story = {
  args: {
    alert: fixtureVisitAlert,
    patient: fixturePatient,
    onClose: () => {},
  },
};
