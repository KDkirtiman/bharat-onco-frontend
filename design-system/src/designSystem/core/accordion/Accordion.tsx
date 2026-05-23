import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { Icon } from '../../icons/Icon';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './accordion.module.css';

type AccordionType = 'single' | 'multiple';

type AccordionContextValue = {
  type: AccordionType;
  openValues: string[];
  toggle: (value: string) => void;
  collapsible: boolean;
  registerTrigger: (value: string, node: HTMLButtonElement | null) => void;
  focusTrigger: (value: string) => void;
  getTriggerValues: () => string[];
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used within Accordion');
  return ctx;
}

type ItemContextValue = {
  value: string;
  triggerId: string;
  panelId: string;
  expanded: boolean;
};

const ItemContext = createContext<ItemContextValue | null>(null);

function useItemContext() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error('Accordion item components must be used within Accordion.Item');
  return ctx;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  children: ReactNode;
};

export function Accordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  className,
  children,
  ...rest
}: AccordionProps) {
  const [current, setCurrent] = useControllableState<string | string[]>({
    value,
    defaultValue: defaultValue ?? (type === 'multiple' ? [] : undefined),
    onChange: onValueChange,
  });

  const openValues = toArray(current);
  const triggersRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const toggle = useCallback(
    (itemValue: string) => {
      if (type === 'multiple') {
        const next = openValues.includes(itemValue)
          ? openValues.filter((v) => v !== itemValue)
          : [...openValues, itemValue];
        setCurrent(next);
        return;
      }

      const isOpen = openValues.includes(itemValue);
      if (isOpen && !collapsible) return;
      setCurrent(isOpen ? '' : itemValue);
    },
    [collapsible, openValues, setCurrent, type],
  );

  const registerTrigger = useCallback((itemValue: string, node: HTMLButtonElement | null) => {
    if (node) triggersRef.current.set(itemValue, node);
    else triggersRef.current.delete(itemValue);
  }, []);

  const getTriggerValues = useCallback(() => Array.from(triggersRef.current.keys()), []);

  const focusTrigger = useCallback((itemValue: string) => {
    triggersRef.current.get(itemValue)?.focus();
  }, []);

  const ctx = useMemo<AccordionContextValue>(
    () => ({
      type,
      openValues,
      toggle,
      collapsible,
      registerTrigger,
      focusTrigger,
      getTriggerValues,
    }),
    [collapsible, focusTrigger, getTriggerValues, openValues, registerTrigger, toggle, type],
  );

  return (
    <AccordionContext.Provider value={ctx}>
      <div {...rest} className={cn(styles.root, className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children: ReactNode;
};

function AccordionItem({ value, className, children, ...rest }: AccordionItemProps) {
  const { openValues } = useAccordionContext();
  const baseId = useStableId('accordion');
  const expanded = openValues.includes(value);

  const itemCtx = useMemo<ItemContextValue>(
    () => ({
      value,
      triggerId: `${baseId}-trigger`,
      panelId: `${baseId}-panel`,
      expanded,
    }),
    [baseId, expanded, value],
  );

  return (
    <ItemContext.Provider value={itemCtx}>
      <div
        {...rest}
        className={cn(styles.item, expanded && styles.expanded, className)}
        data-state={expanded ? 'open' : 'closed'}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function AccordionTrigger({ className, children, onClick, onKeyDown, ...rest }: AccordionTriggerProps) {
  const { toggle, registerTrigger, focusTrigger, getTriggerValues } = useAccordionContext();
  const { value, triggerId, panelId, expanded } = useItemContext();

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      registerTrigger(value, node);
    },
    [registerTrigger, value],
  );

  const focusSibling = (direction: 1 | -1) => {
    const values = getTriggerValues();
    const index = values.indexOf(value);
    if (index === -1) return;
    const nextIndex = (index + direction + values.length) % values.length;
    focusTrigger(values[nextIndex]!);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusSibling(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusSibling(-1);
        break;
      case 'Home':
        event.preventDefault();
        focusTrigger(getTriggerValues()[0] ?? value);
        break;
      case 'End': {
        event.preventDefault();
        const values = getTriggerValues();
        focusTrigger(values[values.length - 1] ?? value);
        break;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggle(value);
        break;
      default:
        break;
    }
  };

  return (
    <button
      {...rest}
      ref={setRef}
      id={triggerId}
      type="button"
      className={cn(styles.trigger, className)}
      aria-expanded={expanded}
      aria-controls={panelId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle(value);
      }}
      onKeyDown={handleKeyDown}
    >
      <span>{children}</span>
      <span className={styles.chevron} aria-hidden="true">
        <Icon name="chevronDown" size="sm" />
      </span>
    </button>
  );
}

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function AccordionPanel({ className, children, ...rest }: AccordionPanelProps) {
  const { panelId, triggerId, expanded } = useItemContext();

  if (!expanded) return null;

  return (
    <div
      {...rest}
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      className={cn(styles.panel, className)}
    >
      <div className={styles.panelInner}>{children}</div>
    </div>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel = AccordionPanel;
