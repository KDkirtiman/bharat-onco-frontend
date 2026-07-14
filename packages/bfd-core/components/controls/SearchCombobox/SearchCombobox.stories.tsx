import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchCombobox } from './SearchCombobox';
import { Avatar } from '../../data-display/Avatar';

const meta: Meta<typeof SearchCombobox> = {
  title: 'Controls/SearchCombobox',
  component: SearchCombobox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchCombobox>;

const ITEMS = [
  { id: '1', primary: 'Jane Doe', secondary: 'MRN-001 · +91 98765 43210', avatar: <Avatar name="Jane Doe" /> },
  { id: '2', primary: 'John Smith', secondary: 'MRN-002 · +91 98765 43211', avatar: <Avatar name="John Smith" /> },
];

export const Default: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const filtered = ITEMS.filter(i =>
      i.primary.toLowerCase().includes(query.toLowerCase()) ||
      i.secondary.toLowerCase().includes(query.toLowerCase()),
    );
    return (
      <SearchCombobox
        query={query}
        onQueryChange={setQuery}
        items={filtered}
        onSelect={() => {}}
        placeholder="Search by name, MRN or phone…"
        emptyTitle="No patients found"
        emptyDescription="Try a different name, MRN or contact"
      />
    );
  },
};
