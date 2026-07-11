import * as styles from './AppointmentCard.styles';
import { useState } from 'react';
import { Calendar, X, Eye, Receipt, FileText, CreditCard, Activity, Stethoscope, ClipboardCheck, Armchair, Syringe, AlertTriangle, CheckCircle2, Hourglass, Play, Printer, ChevronDown } from 'bfd-icons';
import type { Appointment, AppointmentStatus, PaymentType, PaymentStatus } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, getPrimaryActionLabel } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { Doctor } from 'bfd-core';
import type { Invoice } from 'bfd-core';
import { StatusBadge } from 'bfd-core';
import { actionPrimary, cardAccent } from 'bfd-themes';

const NURSE_ACTION_STATUSES: AppointmentStatus[] = [
  'confirmed', 'vitals-in-progress', 'checked-in',
  'chemo-checklist-in-progress', 'chemo-auth-rejected',
  'waiting-chair-assignment', 'chair-assigned', 'in-progress',
];

const ONCOLOGIST_ACTION_STATUSES: AppointmentStatus[] = [
  'vitals-recorded', 'checklist-completed',
  'consult-in-progress', 'staging-in-progress', 'deciding-treatment-plan',
  'chemo-auth-pending',
];

const STAFF_ACTION_STATUSES: AppointmentStatus[] = ['scheduled'];

interface Props {
  appointment:          Appointment;
  patient:              Patient;
  doctor:               Doctor;
  invoice?:             Invoice;
  overdue?:             boolean;
  futureDate?:          boolean;
  userRole?:            string;
  onReschedule:         () => void;
  onCancel:             () => void;
  onViewDetails:        () => void;
  onGenerateInvoice?:   () => void;
  onViewInvoice?:       () => void;
  onPatientClick?:      () => void;
  onPrimaryAction?:       () => void;
  onSecondaryAction?:     () => void;
  secondaryActionLabel?:  string;
  onPrintPrescription?:   () => void;
  onPrintVisitNotes?:     () => void;
}

const PAYMENT_TYPE_CONFIG: Record<PaymentType, { label: string; className: string }> = {
  'self-pay':   { label: 'Self Pay',   className: 'bg-violet-soft text-violet-emphasis'  },
  'insurance':  { label: 'Insurance',  className: 'bg-sky-soft text-sky-emphasis'        },
  'corporate':  { label: 'Corporate',  className: 'bg-orange-soft text-orange-emphasis'  },
  'government': { label: 'Government', className: 'bg-emerald-100 text-emerald-700'},
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  'paid':     { label: 'Paid',     className: 'bg-success-soft text-success-emphasis' },
  'pending':  { label: 'Pending',  className: 'bg-warning-soft text-warning-emphasis' },
  'pre-auth': { label: 'Pre Auth', className: 'bg-info-soft text-info-emphasis'   },
  'waived':   { label: 'Waived',   className: 'bg-neutral-soft text-neutral-emphasis'   },
};

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

const PRIMARY_ACTION_ICON: Record<string, React.ReactNode> = {
  'Pay Now':                  <CreditCard     size={12} />,
  'Record Vitals':            <Activity       size={12} />,
  'Start Consult':            <Stethoscope    size={12} />,
  'Continue Visit':           <Play           size={12} />,
  'Start Pre-Checklist':      <ClipboardCheck size={12} />,
  'Continue Pre-Checklist':   <ClipboardCheck size={12} />,
  'Continue Checklist':       <ClipboardCheck size={12} />,
  'Continue Consult':         <Stethoscope    size={12} />,
  'Start Chemo Checklist':    <ClipboardCheck size={12} />,
  'Complete Chemo Auth':      <CheckCircle2   size={12} />,
  'Start Checklist':          <ClipboardCheck size={12} />,
  'Assign Chair':             <Armchair       size={12} />,
  'Start Chemo':              <Syringe        size={12} />,
  'Complete Chemo':           <CheckCircle2   size={12} />,
};

const PRIMARY_ACTION_CLASS: Record<string, string> = {
  'Pay Now':                  actionPrimary.primary,
  'Record Vitals':            actionPrimary.teal,
  'Start Consult':            actionPrimary.violet,
  'Continue Visit':           actionPrimary.violet,
  'Start Pre-Checklist':      actionPrimary.warning,
  'Continue Pre-Checklist':   actionPrimary.warning,
  'Continue Checklist':       actionPrimary.warning,
  'Start Chemo Checklist':    actionPrimary.sky,
  'Complete Chemo Auth':      actionPrimary.success,
  'Start Checklist':          actionPrimary.warning,
  'Assign Chair':             actionPrimary.indigo,
  'Start Chemo':              actionPrimary.error,
  'Complete Chemo':           actionPrimary.errorDark,
};

export function AppointmentCard({
  appointment, patient, doctor, invoice,
  overdue, futureDate, userRole,
  onReschedule, onCancel, onViewDetails,
  onGenerateInvoice, onViewInvoice, onPatientClick,
  onPrimaryAction, onSecondaryAction, secondaryActionLabel,
  onPrintPrescription, onPrintVisitNotes,
}: Props) {
  const [printOpen, setPrintOpen] = useState(false);
  const isCompleted      = appointment.status === 'completed';
  const isCancelled      = appointment.status === 'cancelled';
  const isScheduled      = appointment.status === 'scheduled';
  // scheduled appointments can still receive "Pay Now" on future dates (pre-invoice prep)
  const restrictActions  = overdue || (futureDate && appointment.status !== 'scheduled');
  const rawPrimaryLabel  = restrictActions ? null : getPrimaryActionLabel(appointment.type, appointment.status);

  const roleAllowsPrimary = !userRole || userRole === 'admin'
    ? true
    : userRole === 'nurse'      ? NURSE_ACTION_STATUSES.includes(appointment.status)
    : userRole === 'oncologist' ? ONCOLOGIST_ACTION_STATUSES.includes(appointment.status)
    : userRole === 'staff'      ? STAFF_ACTION_STATUSES.includes(appointment.status)
    : true;

  // Staff can only reschedule/cancel scheduled appointments; once a visit is active, clinical staff own it
  const roleAllowsRescheduleCancel = !userRole || userRole === 'admin' || userRole === 'nurse' || userRole === 'oncologist'
    ? true
    : userRole === 'staff'
      ? appointment.status === 'scheduled'
      : true;

  const primaryActionLabel = roleAllowsPrimary ? rawPrimaryLabel : null;

  const ptCfg   = appointment.paymentType   ? PAYMENT_TYPE_CONFIG[appointment.paymentType]     : null;
  const psCfg   = appointment.paymentStatus ? PAYMENT_STATUS_CONFIG[appointment.paymentStatus] : null;

  const cardAccentClass = isCompleted  ? cardAccent.success
    : isScheduled  ? cardAccent.warning
    : cardAccent.brand;

  return (
    <div className={`bg-card border border-border border-l-4 ${cardAccentClass} rounded-xl p-4 shadow-sm transition-colors hover:bg-muted/20 ${isCancelled ? 'opacity-60' : ''}`}>

      {/* ── Top row: info + action buttons ── */}
      <div className={styles.style1}>

        {/* Left: appointment info */}
        <div className={styles.style2}>
          <div className={styles.style3}>
            <span className={styles.style4}>{formatTime(appointment.time)}</span>
            {onPatientClick
              ? <button onClick={onPatientClick} className={styles.style5}>{patient.name}</button>
              : <span className={styles.style6}>{patient.name}</span>
            }
            <span className={styles.style7}>{patient.mrn}</span>
            <span className={styles.style8}><StatusBadge status={appointment.status} /></span>
            {overdue && (
              <span className={styles.style9}>
                <Hourglass size={10} />
                Overdue
              </span>
            )}
            <span className={styles.style7}>{APPOINTMENT_TYPE_LABELS[appointment.type]}</span>
          </div>

          <p className={styles.style10}>
            {doctor.name} · {appointment.center}
            <span className={styles.style11}>{appointment.visitId}</span>
          </p>

          {isCancelled && appointment.cancellationReason && (
            <p className={styles.style12}>
              Reason: {appointment.cancellationReason}
            </p>
          )}
        </div>

        {/* Right: action buttons */}
        <div className={styles.style13}>
          {isCompleted && (onPrintPrescription || onPrintVisitNotes) && (
            <div className={styles.style14}>
              <button
                onClick={() => setPrintOpen(p => !p)}
                className={styles.style15}
              >
                <Printer size={12} />
                Print
                <ChevronDown size={11} className={`transition-transform ${printOpen ? 'rotate-180' : ''}`} />
              </button>
              {printOpen && (
                <div className={styles.style16}>
                  {onPrintPrescription && (
                    <button
                      onClick={() => { setPrintOpen(false); onPrintPrescription(); }}
                      className={styles.style17}
                    >
                      <FileText size={12} className={styles.style18} />
                      Prescription
                    </button>
                  )}
                  {onPrintVisitNotes && (
                    <button
                      onClick={() => { setPrintOpen(false); onPrintVisitNotes(); }}
                      className={styles.style17}
                    >
                      <FileText size={12} className={styles.style19} />
                      Visit Notes
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {primaryActionLabel && onPrimaryAction && (
            <button
              onClick={onPrimaryAction}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${PRIMARY_ACTION_CLASS[primaryActionLabel] ?? 'bg-primary text-white hover:bg-primary/90'}`}
            >
              {PRIMARY_ACTION_ICON[primaryActionLabel]}
              {primaryActionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className={styles.style20}
            >
              <AlertTriangle size={12} />
              {secondaryActionLabel}
            </button>
          )}
          {!isCompleted && roleAllowsRescheduleCancel && (
            <button
              onClick={onReschedule}
              className={styles.style21}
            >
              <Calendar size={12} />
              Reschedule
            </button>
          )}
          {!isCompleted && !isCancelled && roleAllowsRescheduleCancel && (
            <button
              onClick={onCancel}
              className={styles.style22}
            >
              <X size={12} />
              Cancel
            </button>
          )}
          <button
            onClick={onViewDetails}
            className={styles.style23}
          >
            <Eye size={12} />
            Details
          </button>
        </div>
      </div>

      {/* ── Bottom row: payment info + invoice action (not for cancelled) ── */}
      {!isCancelled && (
        <div className={styles.style24}>

          {/* Payment badges */}
          <div className={styles.style25}>
            {ptCfg && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ptCfg.className}`}>
                {ptCfg.label}
              </span>
            )}
            {psCfg && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${psCfg.className}`}>
                {psCfg.label}
              </span>
            )}
            {!ptCfg && !psCfg && (
              <span className={styles.style26}>Invoice pending</span>
            )}
          </div>

          {/* Invoice action */}
          {invoice ? (
            <button
              onClick={onViewInvoice}
              className={styles.style27}
            >
              <FileText size={12} />
              {invoice.invoiceNumber}
            </button>
          ) : isScheduled ? (
            <button
              onClick={onGenerateInvoice}
              className={styles.style28}
            >
              <Receipt size={12} />
              Generate Invoice
            </button>
          ) : null}
        </div>
      )}

    </div>
  );
}
