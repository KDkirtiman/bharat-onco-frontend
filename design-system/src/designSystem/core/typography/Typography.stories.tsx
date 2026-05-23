import type { Meta, StoryObj } from '@storybook/react';

import { H1, H2, MutedText, Text } from './Typography';
const meta: Meta = {
  title: 'Core/Typography',
  parameters: {
    liveCode: `render(
  <div style={{ display: 'grid', gap: 10 }}>
    <H1>Admin Dashboard</H1>
    <MutedText>System overview</MutedText>
    <H2>Section</H2>
    <Text>Body text</Text>
  </div>
);`,
    usageCode: `import { H1, H2, MutedText, Text } from '@/designSystem';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
        <H1>Admin Dashboard</H1>
        <MutedText>System overview</MutedText>
        <H2>Section</H2>
        <Text>Body text</Text>
      </div>
  );
}`,
  },
};

export default meta;
type Story = StoryObj;

export const Sample: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <H1>Admin Dashboard</H1>
      <MutedText>System overview and analytics</MutedText>
      <H2>Personal Information</H2>
      <Text>Manage your account settings and profile details.</Text>
    </div>
  ),
};
