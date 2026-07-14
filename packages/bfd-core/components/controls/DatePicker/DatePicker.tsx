import * as styles from './DatePicker.styles';
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'bfd-icons';
import { DayPicker } from 'react-day-picker';


interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  maxDate,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value || new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className={styles.style2} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={styles.triggerButtonClass(!!value)}
      >
        <span>{value ? format(value, 'PPP') : placeholder}</span>
        <CalendarIcon className={styles.style3} />
      </button>

      {open && (
        <div className={styles.style4}>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            month={month}
            onMonthChange={setMonth}
            disabled={[
              ...(maxDate ? [{ after: maxDate }] : []),
              ...(minDate ? [{ before: minDate }] : []),
            ]}
            showOutsideDays
            className={styles.style5}
            classNames={{
              months: 'flex flex-col sm:flex-row gap-2',
              month: 'flex flex-col gap-4',
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'hidden',
              nav: 'flex items-center gap-1',
              nav_button: styles.navBtnClass,
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-x-1',
              head_row: 'flex',
              head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: styles.dayCellClass,
              day: styles.dayBtnClass,
              day_range_start: 'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
              day_range_end: 'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
              day_disabled: 'text-muted-foreground opacity-50',
              day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
              day_hidden: 'invisible',
            }}
            components={{
              Caption: ({ displayMonth }) => (
                <div className={styles.style6}>
                  <select
                    value={displayMonth.getMonth()}
                    onChange={(e) => {
                      const d = new Date(displayMonth);
                      d.setMonth(parseInt(e.target.value));
                      setMonth(d);
                    }}
                    className={styles.style7}
                  >
                    {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                  <select
                    value={displayMonth.getFullYear()}
                    onChange={(e) => {
                      const d = new Date(displayMonth);
                      d.setFullYear(parseInt(e.target.value));
                      setMonth(d);
                    }}
                    className={styles.style7}
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              ),
              IconLeft: () => <ChevronLeft className={styles.style8} />,
              IconRight: () => <ChevronRight className={styles.style8} />,
            }}
          />
        </div>
      )}
    </div>
  );
}
