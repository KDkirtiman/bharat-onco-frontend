import {
  Children,
  isValidElement,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './tabs.module.css';

export type TabProps = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
};

export function Tab(_props: TabProps) {
  return null;
}

Tab.displayName = 'Tab';

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  variant?: 'default' | 'pills';
};

function collectTabs(children: ReactNode): TabProps[] {
  const tabs: TabProps[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<TabProps>;
    if (el.type === Tab) tabs.push(el.props);
  });
  return tabs;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  variant = 'default',
  className,
  ...rest
}: TabsProps) {
  const tabs = collectTabs(children);
  const [active, setActive] = useControllableState({
    value,
    defaultValue: defaultValue ?? tabs[0]?.value,
    onChange: onValueChange,
  });
  const tablistId = useStableId('ds-tabs');

  const focusTab = (tabValue: string) => {
    document.getElementById(`${tablistId}-${tabValue}-tab`)?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = tabs.filter((t) => !t.disabled);
    const index = enabled.findIndex((t) => t.value === active);
    if (index < 0 || enabled.length === 0) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextValue = enabled[(index + direction + enabled.length) % enabled.length].value;
      setActive(nextValue);
      focusTab(nextValue);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(enabled[0].value);
      focusTab(enabled[0].value);
    } else if (event.key === 'End') {
      event.preventDefault();
      const last = enabled[enabled.length - 1].value;
      setActive(last);
      focusTab(last);
    }
  };

  const activeTab = tabs.find((t) => t.value === active);

  return (
    <div {...rest} className={cn(styles.root, className)}>
      <div
        id={tablistId}
        role="tablist"
        className={cn(styles.list, styles[variant])}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tablistId}-${tab.value}-panel`}
              id={`${tablistId}-${tab.value}-tab`}
              disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              className={cn(styles.tab, isActive && styles.active, tab.disabled && styles.disabled)}
              onClick={() => !tab.disabled && setActive(tab.value)}
            >
              {tab.label ?? tab.value}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${tablistId}-${active}-panel`}
        aria-labelledby={`${tablistId}-${active}-tab`}
        className={styles.panel}
      >
        {activeTab?.children}
      </div>
      {children}
    </div>
  );
}

Tabs.Tab = Tab;
