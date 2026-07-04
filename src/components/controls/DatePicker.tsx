import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../../lib/cn';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

const navBtnClass = 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input text-sm hover:bg-accent hover:text-accent-foreground';
const dayBtnClass = 'size-8 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground';

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
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-input rounded-md bg-input-background hover:bg-input/50 transition-colors outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed',
          !value && 'text-muted-foreground'
        )}
      >
        <span>{value ? format(value, 'PPP') : placeholder}</span>
        <CalendarIcon className="size-4 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 rounded-md border border-border bg-card shadow-md p-3 w-auto">
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
            className="p-0"
            classNames={{
              months: 'flex flex-col sm:flex-row gap-2',
              month: 'flex flex-col gap-4',
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'hidden',
              nav: 'flex items-center gap-1',
              nav_button: navBtnClass,
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-x-1',
              head_row: 'flex',
              head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: cn(
                'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
                '[&:has([aria-selected])]:rounded-md'
              ),
              day: dayBtnClass,
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
                <div className="flex justify-center items-center gap-2 mb-2">
                  <select
                    value={displayMonth.getMonth()}
                    onChange={(e) => {
                      const d = new Date(displayMonth);
                      d.setMonth(parseInt(e.target.value));
                      setMonth(d);
                    }}
                    className="px-2 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/50"
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
                    className="px-2 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/50"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              ),
              IconLeft: () => <ChevronLeft className="size-4" />,
              IconRight: () => <ChevronRight className="size-4" />,
            }}
          />
        </div>
      )}
    </div>
  );
}
