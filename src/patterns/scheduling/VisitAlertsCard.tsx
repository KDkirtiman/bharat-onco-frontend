import { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { VisitAlert } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';

interface Props {
  alerts: VisitAlert[];
  patients: Patient[];
  onSchedule?: (alert: VisitAlert) => void;
  onSendReminder?: (alert: VisitAlert) => void;
  onViewDetails?: (alert: VisitAlert) => void;
}

const CARDS_PER_PAGE = 3;

function formatDueDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function isDue(dateStr: string): boolean {
  return dateStr <= new Date().toISOString().split('T')[0];
}

export function VisitAlertsCard({ alerts, patients, onSchedule, onSendReminder, onViewDetails }: Props) {
  const [page, setPage]           = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || alerts.length === 0) return null;

  const totalPages = Math.ceil(alerts.length / CARDS_PER_PAGE);
  const visible    = alerts.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 relative">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-amber-500" />
          <span className="text-sm font-semibold text-amber-800">Visit Alerts</span>
          <span className="text-xs text-amber-600 font-normal">({alerts.length} pending)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-amber-100 text-amber-500 transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Cards + arrows */}
      <div className="flex items-center gap-2">

        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 disabled:opacity-30 disabled:pointer-events-none transition-colors shrink-0"
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
          {visible.map(alert => {
            const patient = patients.find(p => p.id === alert.patientId);
            if (!patient) return null;
            const overdue = isDue(alert.dueDate);

            return (
              <div key={alert.id} className="bg-card border border-amber-100 rounded-lg p-3 shadow-sm flex flex-col">

                {/* Alert info */}
                <p className="text-xs text-muted-foreground mb-0.5">{alert.alertType}</p>
                <p className="text-sm font-semibold text-foreground">{patient.name}</p>
                <p className={`text-xs font-medium mb-3 ${overdue ? 'text-destructive' : 'text-amber-600'}`}>
                  Due: {formatDueDate(alert.dueDate)}
                  {overdue && <span className="ml-1 font-bold">· Overdue</span>}
                </p>

                {/* Primary actions — side by side */}
                <div className="flex gap-1.5 mb-2">
                  <button
                    onClick={() => onSchedule?.(alert)}
                    className="flex-1 text-xs font-medium py-1.5 border border-border rounded-lg text-primary hover:bg-primary/5 transition-colors"
                  >
                    Schedule Now
                  </button>
                  <button
                    onClick={() => onSendReminder?.(alert)}
                    className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Send Reminder
                  </button>
                </div>

                {/* View Details text link */}
                <button
                  onClick={() => onViewDetails?.(alert)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors text-center"
                >
                  View Details →
                </button>

              </div>
            );
          })}
        </div>

        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 disabled:opacity-30 disabled:pointer-events-none transition-colors shrink-0"
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>

      </div>

      {/* Page dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === page ? 'bg-amber-500' : 'bg-amber-200 hover:bg-amber-300'
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
}
