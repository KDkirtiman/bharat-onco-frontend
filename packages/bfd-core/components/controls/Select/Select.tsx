import * as styles from './Select.styles';
import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'bfd-icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: SelectOption[];
  placeholder?: string;
  error?: boolean;
  fieldSize?: 'default' | 'sm';
}

function optionsFromChildren(children: ReactNode): SelectOption[] {
  const result: SelectOption[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<{ value?: string; disabled?: boolean; children?: ReactNode }>(child) && child.type === 'option') {
      result.push({
        value: String(child.props.value ?? ''),
        label: String(child.props.children ?? ''),
        disabled: child.props.disabled,
      });
    }
  });
  return result;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, placeholder, error, fieldSize = 'default', className, children, value, defaultValue, onChange, disabled, id, ...props },
    ref,
  ) => {
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);
    useImperativeHandle(ref, () => hiddenSelectRef.current as HTMLSelectElement);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(String(value ?? defaultValue ?? ''));
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
      if (value !== undefined) setInternalValue(String(value));
    }, [value]);

    const resolvedOptions = useMemo(
      () => (options && options.length > 0 ? options : optionsFromChildren(children)),
      [options, children],
    );

    const allOptions = placeholder
      ? [{ value: '', label: placeholder }, ...resolvedOptions]
      : resolvedOptions;

    const selected = allOptions.find((opt) => opt.value === internalValue);

    useEffect(() => {
      if (!open) return;

      function updatePosition() {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
          setPosition({ top: rect.bottom, left: rect.left, width: rect.width });
        }
      }

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [open]);

    useEffect(() => {
      if (!open) return;
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;
        if (
          containerRef.current && !containerRef.current.contains(target) &&
          listRef.current && !listRef.current.contains(target)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    function selectValue(nextValue: string) {
      setInternalValue(nextValue);
      setOpen(false);
      onChange?.({ target: { value: nextValue } } as ChangeEvent<HTMLSelectElement>);
    }

    return (
      <div ref={containerRef} className={styles.wrapperClass(className)}>
        <select
          ref={hiddenSelectRef}
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          value={internalValue}
          disabled={disabled}
          onChange={() => {}}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
          className={styles.triggerClass(fieldSize, error, disabled)}
        >
          <span className={styles.valueClass(!selected?.value)}>
            {selected?.label ?? placeholder ?? ''}
          </span>
          <ChevronDown className={styles.chevronClass(fieldSize, open)} aria-hidden />
        </button>

        {open &&
          createPortal(
            <ul
              ref={listRef}
              className={styles.listboxClass()}
              style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
              role="listbox"
            >
              {allOptions.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === internalValue}
                  aria-disabled={opt.disabled}
                  onClick={() => !opt.disabled && selectValue(opt.value)}
                  className={styles.optionClass(opt.value === internalValue, opt.disabled)}
                >
                  {opt.label}
                </li>
              ))}
            </ul>,
            document.body,
          )}
      </div>
    );
  },
);

Select.displayName = 'Select';
