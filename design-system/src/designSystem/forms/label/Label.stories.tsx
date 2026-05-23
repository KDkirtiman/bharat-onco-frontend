import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './Label';
const meta: Meta<typeof Label> = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    liveCode: `render(<Label htmlFor="patient" required hint="As on ID card">Patient name</Label>);`,
        usageCode: `import { Label } from '@/designSystem';

export function Example() {
  return (
    <Label htmlFor="patient" required hint="As on ID card">Patient name</Label>
  );
}`,
    docs: {
      description: {
        component:
          'Associates human-readable text with a form control via `htmlFor`. Supports required indicators, optional hints, and two density sizes. Always pair with an input that has a matching `id`.',
      },
      subtitle: 'Accessible text label for form controls',
      guide: {
        whenToUse: [
          'Every visible form field should have a label (do not rely on placeholder alone).',
          'Use `required` when the field is mandatory — the asterisk is visual; also set `required` on the input.',
          'Use `hint` for format examples or policy text that is not an error.',
        ],
        capabilities: [
          'Required field indicator (`*` + implicit association)',
          'Secondary hint line below the label text',
          'Sizes: `sm` for dense tables, `md` for default forms',
          'Extends native `<label>` — pass `className`, `id`, events, etc.',
        ],
        scenarios: [
          { title: 'Default label', description: 'Standard label linked to an input id.', story: 'Default' },
          { title: 'Required field', description: 'Mandatory fields in registration flows.', story: 'Required' },
          { title: 'With hint', description: 'Helper text for ID format or clinical instructions.', story: 'WithHint' },
          { title: 'Compact density', description: 'Use `size="sm"` in dense screens.', story: 'Small' },
        ],
        related: [{ label: 'TextField' }, { label: 'FormErrors' }, { label: 'Checkbox' }],
      },
    },
  },
  args: {
    htmlFor: 'patient-name',
    children: 'Patient name',
  },
  argTypes: {
    htmlFor: {
      description:
        '**Required.** Must match the `id` of the associated input so clicking the label focuses the control.',
    },
    children: { description: 'Label text (React node). Keep concise; put long help in `hint`.' },
    required: {
      description:
        'When `true`, renders a visual asterisk. Also set `required` on the control for assistive tech.',
    },
    hint: {
      description:
        'Optional secondary line (format guidance, not validation errors — use `Message` or `FormErrors` for errors).',
    },
    size: { description: '`sm` | `md` — typographic density. Default: `md`.' },
    className: { description: 'Extra CSS classes on the root `<label>`.' },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithHint: Story = {
  args: { hint: 'As shown on the hospital ID card' },
};

export const Small: Story = {
  args: { size: 'sm', required: true, hint: 'Optional helper text' },
};
