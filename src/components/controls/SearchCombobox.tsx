import { useState, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';
import { TextField } from './TextField';
import { EmptyState } from '../feedback/EmptyState';

export interface SearchComboboxItem {
  id: string;
  primary: string;
  secondary?: string;
  avatar?: ReactNode;
}

interface SearchComboboxProps<T extends SearchComboboxItem> {
  query: string;
  onQueryChange: (query: string) => void;
  items: T[];
  onSelect: (item: T) => void;
  placeholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  error?: boolean;
  renderItem?: (item: T) => ReactNode;
  className?: string;
}

export function SearchCombobox<T extends SearchComboboxItem>({
  query,
  onQueryChange,
  items,
  onSelect,
  placeholder = 'Search…',
  emptyTitle = 'No results found',
  emptyDescription,
  error,
  renderItem,
  className,
}: SearchComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <TextField
        type="text"
        placeholder={placeholder}
        value={query}
        icon={<Search size={14} />}
        error={error}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.trim() && setOpen(true)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      />
      {open && query.trim() && (
        <div className="mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
              >
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <>
                    {item.avatar}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.primary}</p>
                      {item.secondary && (
                        <p className="text-xs text-muted-foreground">{item.secondary}</p>
                      )}
                    </div>
                  </>
                )}
              </button>
            ))
          ) : (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          )}
        </div>
      )}
    </div>
  );
}
