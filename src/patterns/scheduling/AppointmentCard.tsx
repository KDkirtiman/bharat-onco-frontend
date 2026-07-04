import { useState } from 'react';
import { Calendar, X, Eye, Receipt, FileText, CreditCard, Activity, Stethoscope, ClipboardCheck, Armchair, Syringe, AlertTriangle, CheckCircle2, Hourglass, Play, Printer, ChevronDown } from 'lucide-react';
import type { Appointment, AppointmentStatus, PaymentType, PaymentStatus } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS, getPrimaryActionLabel } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import type { Doctor } from '../../datapoints/scheduling';
import type { Invoice } from '../../datapoints/billing';
import { StatusBadge } from '../../components/feedback/StatusBadge';

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
  'self-pay':   { label: 'Self Pay',   className: 'bg-violet-100 text-violet-700'  },
  'insurance':  { label: 'Insurance',  className: 'bg-sky-100 text-sky-700'        },
  'corporate':  { label: 'Corporate',  className: 'bg-orange-100 text-orange-700'  },
  'government': { label: 'Government', className: 'bg-emerald-100 text-emerald-700'},
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  'paid':     { label: 'Paid',     className: 'bg-green-100 text-green-700' },
  'pending':  { label: 'Pending',  className: 'bg-amber-100 text-amber-700' },
  'pre-auth': { label: 'Pre Auth', className: 'bg-blue-100 text-blue-700'   },
  'waived':   { label: 'Waived',   className: 'bg-gray-100 text-gray-500'   },
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
  'Pay Now':                  'bg-primary text-white hover:bg-primary/90',
  'Record Vitals':            'bg-teal-600 text-white hover:bg-teal-700',
  'Start Consult':            'bg-violet-600 text-white hover:bg-violet-700',
  'Continue Visit':           'bg-violet-600 text-white hover:bg-violet-700',
  'Start Pre-Checklist':      'bg-amber-500 text-white hover:bg-amber-600',
  'Continue Pre-Checklist':   'bg-amber-400 text-white hover:bg-amber-500',
  'Continue Checklist':       'bg-amber-400 text-white hover:bg-amber-500',
  'Start Chemo Checklist':    'bg-sky-600 text-white hover:bg-sky-700',
  'Complete Chemo Auth':      'bg-green-600 text-white hover:bg-green-700',
  'Start Checklist':          'bg-amber-500 text-white hover:bg-amber-600',
  'Assign Chair':             'bg-indigo-600 text-white hover:bg-indigo-700',
  'Start Chemo':              'bg-red-600 text-white hover:bg-red-700',
  'Complete Chemo':           'bg-red-700 text-white hover:bg-red-800',
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

  const cardAccent = isCompleted  ? 'border-l-green-500'
    : isScheduled  ? 'border-l-orange-400'
    : 'border-l-purple-500';

  return (
    <div className={`bg-card border border-border border-l-4 ${cardAccent} rounded-xl p-4 shadow-sm transition-colors hover:bg-muted/20 ${isCancelled ? 'opacity-60' : ''}`}>

      {/* ── Top row: info + action buttons ── */}
      <div className="flex items-start gap-4">

        {/* Left: appointment info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-bold text-primary shrink-0">{formatTime(appointment.time)}</span>
            {onPatientClick
              ? <button onClick={onPatientClick} className="text-sm font-semibold text-primary hover:underline text-left">{patient.name}</button>
              : <span className="text-sm font-semibold text-foreground">{patient.name}</span>
            }
            <span className="text-xs text-muted-foreground">{patient.mrn}</span>
            <span className="shrink-0"><StatusBadge status={appointment.status} /></span>
            {overdue && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0 bg-orange-100 text-orange-700 flex items-center gap-1">
                <Hourglass size={10} />
                Overdue
              </span>
            )}
            <span className="text-xs text-muted-foreground">{APPOINTMENT_TYPE_LABELS[appointment.type]}</span>
          </div>

          <p className="text-xs text-muted-foreground mt-1.5">
            {doctor.name} · {appointment.center}
            <span className="ml-2 font-mono text-[11px] text-muted-foreground/70">{appointment.visitId}</span>
          </p>

          {isCancelled && appointment.cancellationReason && (
            <p className="text-xs text-destructive mt-1 italic">
              Reason: {appointment.cancellationReason}
            </p>
          )}
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
          {isCompleted && (onPrintPrescription || onPrintVisitNotes) && (
            <div className="relative">
              <button
                onClick={() => setPrintOpen(p => !p)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Printer size={12} />
                Print
                <ChevronDown size={11} className={`transition-transform ${printOpen ? 'rotate-180' : ''}`} />
              </button>
              {printOpen && (
                <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                  {onPrintPrescription && (
                    <button
                      onClick={() => { setPrintOpen(false); onPrintPrescription(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <FileText size={12} className="text-primary" />
                      Prescription
                    </button>
                  )}
                  {onPrintVisitNotes && (
                    <button
                      onClick={() => { setPrintOpen(false); onPrintVisitNotes(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <FileText size={12} className="text-violet-600" />
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
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <AlertTriangle size={12} />
              {secondaryActionLabel}
            </button>
          )}
          {!isCompleted && roleAllowsRescheduleCancel && (
            <button
              onClick={onReschedule}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            >
              <Calendar size={12} />
              Reschedule
            </button>
          )}
          {!isCompleted && !isCancelled && roleAllowsRescheduleCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X size={12} />
              Cancel
            </button>
          )}
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <Eye size={12} />
            Details
          </button>
        </div>
      </div>

      {/* ── Bottom row: payment info + invoice action (not for cancelled) ── */}
      {!isCancelled && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 gap-2 flex-wrap">

          {/* Payment badges */}
          <div className="flex items-center gap-1.5">
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
              <span className="text-xs text-muted-foreground italic">Invoice pending</span>
            )}
          </div>

          {/* Invoice action */}
          {invoice ? (
            <button
              onClick={onViewInvoice}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors font-mono"
            >
              <FileText size={12} />
              {invoice.invoiceNumber}
            </button>
          ) : isScheduled ? (
            <button
              onClick={onGenerateInvoice}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
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
