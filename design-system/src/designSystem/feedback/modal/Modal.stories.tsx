import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { Button } from '../../core/button/Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
    parameters: {
    docs: {
      description: { component: "Compound component: `Modal.Header`, `Modal.Body`, `Modal.Footer`. Renders in a portal with overlay scrim." },
      subtitle: "Focus-trapped overlay dialog",
      guide: {
  "whenToUse": [
    "Confirm destructive actions.",
    "Short forms that need focus.",
    "Detail previews without navigation."
  ],
  "capabilities": [
    "open/onOpenChange",
    "sizes sm/md/lg",
    "closeOnOverlay",
    "Escape to close",
    "compound slots"
  ],
  "scenarios": [
    {
      "title": "Default dialog",
      "story": "Default",
      "description": "Open/close flow."
    },
    {
      "title": "Sizes",
      "story": "Sizes",
      "description": "sm/md/lg width."
    }
  ]
},
    },
    liveCode: `render(function ModalPlayground() {
  const [open, setOpen] = React.useState(false);
  return (
  <>
    <Button onClick={() => setOpen(true)}>Open modal</Button>
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Header>Title</Modal.Header>
      <Modal.Body><Text>Body</Text></Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => setOpen(false)}>OK</Button>
      </Modal.Footer>
    </Modal>
  </>
  );
});`,
        usageCode: `import { Button, Modal, Text } from '@/designSystem';
import { useState } from 'react';
export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Header>Title</Modal.Header>
        <Modal.Body><Text>Body</Text></Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}`,
  },
  tags: ['autodocs'],
  args: {
    size: 'md',
    closeOnOverlay: true,
  },
  argTypes: {
    open: { description: "Whether dialog is visible." },
    onOpenChange: { description: "Called when open state should change." },
    size: { description: "`sm` | `md` | `lg`." },
    closeOnOverlay: { description: "Click outside to close." },
    children: { description: "Modal compound children." },
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: function ModalDemo(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <Modal.Header>Confirm action</Modal.Header>
          <Modal.Body>
            Are you sure you want to proceed? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /open modal/i }));
    const dialog = await screen.findByRole('dialog');
    await expect(dialog).toBeVisible();
    await userEvent.click(within(dialog).getByRole('button', { name: /cancel/i }));
    await expect(screen.queryByRole('dialog')).toBeNull();
  },
};

export const Sizes: Story = {
  render: function ModalSizes() {
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button
            key={s}
            variant="secondary"
            onClick={() => {
              setSize(s);
              setOpen(true);
            }}
          >
            {s.toUpperCase()}
          </Button>
        ))}
        <Modal size={size} open={open} onOpenChange={setOpen}>
          <Modal.Header>{size.toUpperCase()} modal</Modal.Header>
          <Modal.Body>Modal content for the {size} size variant.</Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};
