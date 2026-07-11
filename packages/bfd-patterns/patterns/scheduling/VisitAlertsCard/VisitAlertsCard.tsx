import * as styles from './VisitAlertsCard.styles';
import { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, X } from 'bfd-icons';
import type { VisitAlert } from 'bfd-core';
import type { Patient } from 'bfd-core';

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
    <div className={styles.style1}>

      {/* Header */}
      <div className={styles.style2}>
        <div className={styles.style3}>
          <Bell size={16} className={styles.style4} />
          <span className={styles.style5}>Visit Alerts</span>
          <span className={styles.style6}>({alerts.length} pending)</span>
        </div>
        <div className={styles.style3}>
          <button
            onClick={() => setDismissed(true)}
            className={styles.style7}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Cards + arrows */}
      <div className={styles.style3}>

        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className={styles.style8}
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>

        <div className={styles.style9}>
          {visible.map(alert => {
            const patient = patients.find(p => p.id === alert.patientId);
            if (!patient) return null;
            const overdue = isDue(alert.dueDate);

            return (
              <div key={alert.id} className={styles.style10}>

                {/* Alert info */}
                <p className={styles.style11}>{alert.alertType}</p>
                <p className={styles.style12}>{patient.name}</p>
                <p className={`text-xs font-medium mb-3 ${overdue ? 'text-destructive' : 'text-warning-emphasis-mid'}`}>
                  Due: {formatDueDate(alert.dueDate)}
                  {overdue && <span className={styles.style13}>· Overdue</span>}
                </p>

                {/* Primary actions — side by side */}
                <div className={styles.style14}>
                  <button
                    onClick={() => onSchedule?.(alert)}
                    className={styles.style15}
                  >
                    Schedule Now
                  </button>
                  <button
                    onClick={() => onSendReminder?.(alert)}
                    className={styles.style16}
                  >
                    Send Reminder
                  </button>
                </div>

                {/* View Details text link */}
                <button
                  onClick={() => onViewDetails?.(alert)}
                  className={styles.style17}
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
          className={styles.style8}
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>

      </div>

      {/* Page dots */}
      {totalPages > 1 && (
        <div className={styles.style18}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === page ? 'bg-warning-solid' : 'bg-warning-border hover:bg-warning-border'
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
}
