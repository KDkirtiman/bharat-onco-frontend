import type { Meta, StoryObj } from '@storybook/react';
import { PatientRegistrationOverlay } from './PatientRegistrationOverlay';
import { fixturePatients } from '../../stories/fixtures';
import { hideArgs, overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof PatientRegistrationOverlay> = {
  title: 'Patterns/Clinical/PatientRegistrationOverlay',
  component: PatientRegistrationOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['patients'], 'Data'),
    ...hideArgs(['onRegister', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof PatientRegistrationOverlay>;

export const Default: Story = {
  args: {
    selectedCenter: 'Kurukshetra',
    patients: fixturePatients,
    onRegister: () => {},
    onClose: () => {},
  },
};
