import type { Meta, StoryObj } from '@storybook/react';
import { CalendarPlus } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { Button } from '../controls/Button';
import { overlayStoryParameters } from '../../stories/overlayStoryParams';

const meta: Meta<typeof Modal> = {
  title: 'Layout/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => (
    <Modal onClose={() => {}}>
      <ModalHeader title="Example Modal" icon={<CalendarPlus size={16} />} onClose={() => {}} />
      <ModalBody>
        <p className="text-sm text-muted-foreground">Modal body content goes here.</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </ModalFooter>
    </Modal>
  ),
};

export const Large: Story = {
  render: () => (
    <Modal onClose={() => {}} size="lg">
      <ModalHeader title="Large Modal" onClose={() => {}} />
      <ModalBody><p className="text-sm">Wide content area.</p></ModalBody>
    </Modal>
  ),
};
