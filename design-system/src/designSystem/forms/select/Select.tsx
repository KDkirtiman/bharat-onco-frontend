import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';
import { Portal } from '../../utils/Portal';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './select.module.css';

export type SelectItemData = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectItemProps = {
  value: string;
  disabled?: boolean;
  children: ReactNode;
};

export function SelectItem(_props: SelectItemProps) {
  return null;
}

SelectItem.displayName = 'SelectItem';

function isSelectItemElement(child: ReactElement): boolean {
  const type = child.type as { displayName?: string };
  return type === SelectItem || type?.displayName === 'SelectItem';
}

function collectItems(children: ReactNode): SelectItemData[] {
  const items: SelectItemData[] = [];

  const visit = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;
      const element = child as ReactElement<SelectItemProps>;

      if (isSelectItemElement(element)) {
        items.push({
          value: element.props.value,
          label: element.props.children,
          disabled: element.props.disabled,
        });
        return;
      }

      // Story helpers and fragments wrap items: <Select>{<>...</>}</Select>
      const nested = (element.props as { children?: ReactNode }).children;
      if (nested != null) {
        visit(nested);
      }
    });
  };

  visit(children);
  return items;
}

function getLabelText(label: ReactNode): string {
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }
  return '';
}

export type SelectDisplaySelectedAs = 'text' | 'chips';

export type SelectProps = {
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  /** When `multiple`, show selections as removable chips instead of comma-separated text. */
  displaySelectedAs?: SelectDisplaySelectedAs;
  /**
   * When `displaySelectedAs` is `chips`, max chips shown in the trigger before a
   * `+N more` overflow indicator (defaults to 2). Keeps the field one line tall.
   */
  maxVisibleChips?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children: ReactNode;
};

export function Select({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false,
  displaySelectedAs = 'text',
  maxVisibleChips,
  disabled = false,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
}: SelectProps) {
  const selectId = useStableId('ds-select');
  const listboxId = useStableId('ds-select-listbox');
  const resolvedId = id ?? selectId;
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  const [menuMaxHeight, setMenuMaxHeight] = useState(240);
  const [items, setItems] = useState<SelectItemData[]>(() => collectItems(children));

  const [selectedValue, setSelectedValue] = useControllableState<string | string[]>({
    value,
    defaultValue: defaultValue ?? (multiple ? [] : ''),
    onChange: onValueChange,
  });

  useEffect(() => {
    setItems(collectItems(children));
  }, [children]);

  const selectedValues = useMemo(
    () => (Array.isArray(selectedValue) ? selectedValue : selectedValue ? [selectedValue] : []),
    [selectedValue],
  );

  const filteredItems = useMemo(() => {
    if (!searchable || !query.trim()) return items;
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => getLabelText(item.label).toLowerCase().includes(normalized));
  }, [items, query, searchable]);

  const resolveLabel = useCallback(
    (val: string) => {
      const item = items.find((entry) => entry.value === val);
      if (item) return getLabelText(item.label) || item.value;
      return val;
    },
    [items],
  );

  const selectedEntries = useMemo(
    () => selectedValues.map((val) => ({ value: val, label: resolveLabel(val) })),
    [resolveLabel, selectedValues],
  );

  const displayLabel = useMemo(() => {
    if (selectedValues.length === 0) return placeholder;
    const labels = selectedEntries.map((entry) => entry.label).filter(Boolean);
    return labels.length > 0 ? labels.join(', ') : placeholder;
  }, [placeholder, selectedEntries, selectedValues.length]);

  const showChips = multiple && displaySelectedAs === 'chips';
  const chipLimit = showChips ? Math.max(0, maxVisibleChips ?? 2) : 0;

  const chipDisplay = useMemo(() => {
    if (!showChips) {
      return { visible: selectedEntries, overflowCount: 0 };
    }
    if (selectedEntries.length <= chipLimit) {
      return { visible: selectedEntries, overflowCount: 0 };
    }
    return {
      visible: selectedEntries.slice(0, chipLimit),
      overflowCount: selectedEntries.length - chipLimit,
    };
  }, [chipLimit, selectedEntries, showChips]);

  const removeSelected = useCallback(
    (val: string) => {
      if (!multiple) return;
      setSelectedValue(selectedValues.filter((entry) => entry !== val));
    },
    [multiple, selectedValues, setSelectedValue],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setHighlightIndex(0);
  }, []);

  const openList = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    const firstEnabled = filteredItems.findIndex((item) => !item.disabled);
    setHighlightIndex(firstEnabled >= 0 ? firstEnabled : 0);
  }, [disabled, filteredItems]);

  const selectItem = useCallback(
    (item: SelectItemData) => {
      if (item.disabled) return;

      if (multiple) {
        const next = selectedValues.includes(item.value)
          ? selectedValues.filter((val) => val !== item.value)
          : [...selectedValues, item.value];
        setSelectedValue(next);
      } else {
        setSelectedValue(item.value);
        close();
        triggerRef.current?.focus();
      }
    },
    [close, multiple, selectedValues, setSelectedValue],
  );

  useLayoutEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    if (!trigger) return;

    const updatePosition = () => {
      const placement = computePopoverPlacement(trigger);
      setPopoverStyle(placement.style);
      setMenuMaxHeight(placement.maxMenuHeight);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(trigger);
    return () => {
      window.removeEventListener('resize', updatePosition);
      resizeObserver.disconnect();
    };
  }, [open, filteredItems.length, selectedValues.length, chipDisplay.overflowCount, showChips]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        close();
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && popoverRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener('mousedown', handlePointerDown, true);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [close, open]);

  const moveHighlight = useCallback(
    (direction: 1 | -1) => {
      if (filteredItems.length === 0) return;
      let index = highlightIndex;
      for (let step = 0; step < filteredItems.length; step += 1) {
        index = (index + direction + filteredItems.length) % filteredItems.length;
        if (!filteredItems[index]?.disabled) {
          setHighlightIndex(index);
          break;
        }
      }
    },
    [filteredItems, highlightIndex],
  );

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          openList();
        } else {
          moveHighlight(event.key === 'ArrowDown' ? 1 : -1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) {
          openList();
        } else if (filteredItems[highlightIndex]) {
          selectItem(filteredItems[highlightIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveHighlight(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveHighlight(-1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (filteredItems[highlightIndex]) {
          selectItem(filteredItems[highlightIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn(styles.root, className)}>
        <div
          ref={triggerRef}
          id={resolvedId}
          role="combobox"
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            styles.trigger,
            showChips && styles.triggerWithChips,
            open && styles.triggerOpen,
            disabled && styles.disabled,
          )}
          onClick={() => {
            if (disabled) return;
            open ? close() : openList();
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          {showChips ? (
            <span className={styles.valueChips}>
              {selectedEntries.length === 0 ? (
                <span className={styles.placeholder}>{placeholder}</span>
              ) : (
                <>
                  {chipDisplay.visible.map((entry) => (
                    <span key={entry.value} className={styles.chip}>
                      {entry.label}
                      {!disabled ? (
                        <button
                          type="button"
                          className={styles.chipRemove}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeSelected(entry.value);
                          }}
                          aria-label={`Remove ${entry.label}`}
                        >
                          ×
                        </button>
                      ) : null}
                    </span>
                  ))}
                  {chipDisplay.overflowCount > 0 ? (
                    <span
                      className={styles.chipOverflow}
                      title={`${chipDisplay.overflowCount} more selected`}
                    >
                      +{chipDisplay.overflowCount} more
                    </span>
                  ) : null}
                </>
              )}
            </span>
          ) : (
            <span className={cn(styles.value, selectedValues.length === 0 && styles.placeholder)}>
              {displayLabel}
            </span>
          )}
          <span className={styles.chevron} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="1em" height="1em">
              <path
                d="m6 9 6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {open ? (
          <Portal>
            <div ref={popoverRef} className={styles.popover} style={popoverStyle}>
              {searchable ? (
                <div className={styles.searchWrap}>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setHighlightIndex(0);
                    }}
                    placeholder="Search…"
                    className={styles.searchInput}
                    aria-label="Search options"
                  />
                </div>
              ) : null}
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-multiselectable={multiple || undefined}
                aria-labelledby={ariaLabelledBy}
                aria-label={ariaLabel}
                tabIndex={-1}
                className={styles.listbox}
                style={{ maxHeight: menuMaxHeight }}
                onKeyDown={handleListKeyDown}
              >
                {filteredItems.length === 0 ? (
                  <li className={styles.empty}>No options found</li>
                ) : (
                  filteredItems.map((item, index) => {
                    const isSelected = selectedValues.includes(item.value);
                    const isHighlighted = index === highlightIndex;
                    return (
                      <li
                        key={item.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={item.disabled || undefined}
                        className={cn(
                          styles.option,
                          isSelected && styles.optionSelected,
                          isHighlighted && styles.optionHighlighted,
                          item.disabled && styles.optionDisabled,
                        )}
                        onMouseEnter={() => setHighlightIndex(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectItem(item)}
                      >
                        <span className={styles.optionLabel}>{item.label}</span>
                        {multiple && isSelected ? (
                          <span className={styles.checkmark} aria-hidden="true">✓</span>
                        ) : null}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </Portal>
        ) : null}
    </div>
  );
}

const MENU_GAP_PX = 4;
const VIEWPORT_MARGIN_PX = 8;
const PREFERRED_MENU_HEIGHT_PX = 240;
const MIN_MENU_HEIGHT_PX = 80;
/** Prefer opening below when at least this much space exists */
const PREFER_BELOW_MIN_PX = 120;

function computePopoverPlacement(trigger: HTMLElement | null): {
  style: CSSProperties;
  maxMenuHeight: number;
  placement: 'below' | 'above';
} {
  if (typeof window === 'undefined' || !trigger) {
    return {
      style: {},
      maxMenuHeight: PREFERRED_MENU_HEIGHT_PX,
      placement: 'below',
    };
  }

  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN_PX;
  const spaceAbove = rect.top - VIEWPORT_MARGIN_PX;
  const openBelow = spaceBelow >= PREFER_BELOW_MIN_PX || spaceBelow >= spaceAbove;
  const available = openBelow ? spaceBelow : spaceAbove;
  const maxMenuHeight = Math.max(
    MIN_MENU_HEIGHT_PX,
    Math.min(PREFERRED_MENU_HEIGHT_PX, available - MENU_GAP_PX),
  );

  const base: CSSProperties = {
    position: 'fixed',
    left: rect.left,
    width: rect.width,
  };

  if (openBelow) {
    return {
      placement: 'below',
      maxMenuHeight,
      style: { ...base, top: rect.bottom + MENU_GAP_PX },
    };
  }

  return {
    placement: 'above',
    maxMenuHeight,
    style: { ...base, bottom: window.innerHeight - rect.top + MENU_GAP_PX },
  };
}
