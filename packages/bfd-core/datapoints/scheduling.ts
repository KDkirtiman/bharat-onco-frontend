import { badge } from 'bfd-themes';

export type AppointmentStatus =
  | 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled'
  | 'vitals-in-progress' | 'vitals-recorded' | 'checklist-completed' | 'chair-assigned'
  | 'chemo-checklist-in-progress' | 'consult-in-progress' | 'waiting-chair-assignment'
  | 'staging-in-progress' | 'deciding-treatment-plan'
  | 'chemo-auth-pending' | 'chemo-auth-rejected';

export type AppointmentType = 'initial-visit' | 'regular-visit' | 'follow-up' | 'chemo-session' | 'follow-up-free' | 'post-chemo-follow-up';

export type PaymentType    = 'self-pay' | 'insurance' | 'corporate' | 'government';
export type PaymentStatus  = 'paid' | 'pending' | 'pre-auth' | 'waived';
export type SelfPayMethod  = 'cash' | 'upi' | 'cheque' | 'credit-card' | 'debit-card';

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  'initial-visit':        'Initial Visit',
  'regular-visit':        'Regular Visit',
  'follow-up':            'Follow Up',
  'chemo-session':        'Chemo Session',
  'follow-up-free':       'Follow Up (Free)',
  'post-chemo-follow-up': 'Post Chemo Follow Up',
};

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  'scheduled':                    'Scheduled',
  'confirmed':                    'Confirmed',
  'checked-in':                   'Checked In',
  'in-progress':                  'In Progress',
  'completed':                    'Completed',
  'cancelled':                    'Cancelled',
  'vitals-in-progress':           'Vitals In Progress',
  'vitals-recorded':              'Vitals Recorded',
  'checklist-completed':          'Checklist Done',
  'chair-assigned':               'Chair Assigned',
  'chemo-checklist-in-progress':  'Pre-Checklist In Progress',
  'consult-in-progress':          'Consult In Progress',
  'waiting-chair-assignment':     'Waiting Chair',
  'staging-in-progress':          'Staging In Progress',
  'deciding-treatment-plan':      'Deciding Treatment Plan',
  'chemo-auth-pending':           'Chemo Auth Pending',
  'chemo-auth-rejected':          'Chemo Auth Rejected',
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  'self-pay':   'Self Pay',
  'insurance':  'Insurance',
  'corporate':  'Corporate',
  'government': 'Government Scheme',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  'paid':     'Paid',
  'pending':  'Pending',
  'pre-auth': 'Pre Auth',
  'waived':   'Waived',
};

export const SELF_PAY_METHOD_LABELS: Record<SelfPayMethod, string> = {
  'cash':        'Cash',
  'upi':         'UPI',
  'cheque':      'Cheque',
  'credit-card': 'Credit Card',
  'debit-card':  'Debit Card',
};

export const CENTERS = ['Kurukshetra', 'Panipat', 'Shimla', 'Una', 'Deoria'] as const;
export type Center = typeof CENTERS[number];

export const APPOINTMENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  scheduled:                     { label: 'Scheduled',               className: badge.muted },
  confirmed:                     { label: 'Confirmed',               className: badge.info },
  'checked-in':                  { label: 'Checked In',              className: 'bg-primary/10 text-primary' },
  'vitals-in-progress':          { label: 'Vitals In Progress',      className: badge.tealSurface },
  'vitals-recorded':             { label: 'Vitals Recorded',         className: badge.teal },
  'chemo-checklist-in-progress': { label: 'Pre-Checklist Active',    className: badge.warning },
  'checklist-completed':         { label: 'Checklist Done',          className: badge.purple },
  'consult-in-progress':         { label: 'Consult In Progress',     className: badge.violet },
  'staging-in-progress':         { label: 'Staging In Progress',     className: badge.purple },
  'deciding-treatment-plan':     { label: 'Deciding Treatment Plan', className: badge.indigo },
  'chemo-auth-pending':          { label: 'Chemo Auth Pending',      className: badge.warningSurface },
  'chemo-auth-rejected':         { label: 'Chemo Auth Rejected',     className: badge.error },
  'waiting-chair-assignment':    { label: 'Waiting Chair',           className: badge.sky },
  'chair-assigned':              { label: 'Chair Assigned',          className: badge.indigo },
  'in-progress':                 { label: 'In Progress',             className: badge.warning },
  completed:                     { label: 'Completed',               className: badge.success },
  cancelled:                     { label: 'Cancelled',               className: badge.destructive },
};

export const CENTER_INITIALS: Record<string, string> = {
  'Kurukshetra': 'KRK',
  'Panipat':     'PNP',
  'Shimla':      'SML',
  'Una':         'UNA',
  'Deoria':      'DRA',
};

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

export interface ScheduleFormData {
  date:     string;
  time:     string;
  doctorId: string;
  type:     AppointmentType;
  center:   string;
  notes?:   string;
}

export interface Appointment {
  id:                  string;
  visitId:             string;
  patientId:           string;
  doctorId:            string;
  date:                string;
  time:                string;
  type:                AppointmentType;
  status:              AppointmentStatus;
  center:              string;
  cancellationReason?: string;
  invoiceId?:          string;
  paymentType?:        PaymentType;
  paymentStatus?:      PaymentStatus;
  paymentMethod?:      SelfPayMethod;
  transactionId?:      string;
  notes?:              string;
  chairId?:            string;
}

export function getPrimaryActionLabel(type: AppointmentType, status: AppointmentStatus): string | null {
  const isChemo = type === 'chemo-session';
  switch (status) {
    case 'scheduled':                   return 'Pay Now';
    case 'confirmed':                   return 'Record Vitals';
    case 'vitals-in-progress':          return 'Continue Visit';
    case 'chemo-checklist-in-progress': return isChemo ? 'Continue Checklist' : null;
    case 'chemo-auth-pending':          return isChemo ? 'Complete Chemo Auth' : null;
    case 'chemo-auth-rejected':         return isChemo ? 'Start Checklist' : null;
    case 'vitals-recorded':             return isChemo ? null : 'Start Consult';
    case 'checklist-completed':         return isChemo ? null : null;
    case 'consult-in-progress':         return 'Continue Consult';
    case 'staging-in-progress':         return isChemo ? null : 'Continue Visit';
    case 'deciding-treatment-plan':     return isChemo ? null : 'Continue Visit';
    case 'checked-in':                  return isChemo ? 'Start Chemo Checklist' : null;
    case 'waiting-chair-assignment':    return isChemo ? 'Assign Chair' : null;
    case 'chair-assigned':              return isChemo ? 'Start Chemo' : null;
    case 'in-progress':                 return isChemo ? 'Complete Chemo' : null;
    default:                            return null;
  }
}

export function generateTimeSlots(type: AppointmentType): string[] {
  const interval = type === 'initial-visit' ? 20 : 10;
  const slots: string[] = [];
  let mins = 8 * 60;
  while (mins < 18 * 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    mins += interval;
  }
  return slots;
}

export function generateVisitId(center: string, date: string, seq: number): string {
  const initials = CENTER_INITIALS[center] ?? center.slice(0, 3).toUpperCase();
  const [y, m, d] = date.split('-');
  return `VS-${initials}-${d}${m}${y.slice(2)}-${String(seq).padStart(3, '0')}`;
}

export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Rahul Mehta',  specialization: 'Senior Oncologist'     },
  { id: 'd2', name: 'Dr. Priya Kapoor', specialization: 'Radiation Oncologist'  },
  { id: 'd3', name: 'Dr. Anil Verma',   specialization: 'Medical Oncologist'    },
  { id: 'd4', name: 'Dr. Sunita Rao',   specialization: 'Surgical Oncologist'   },
];

// ── Follow-up date constraints ─────────────────────────────────────────────────

export const CLINIC_HOLIDAYS: string[] = [
  '2026-01-26', // Republic Day
  '2026-03-27', // Holi
  '2026-04-14', // Baisakhi / Ambedkar Jayanti
  '2026-04-17', // Good Friday
  '2026-08-15', // Independence Day
  '2026-10-02', // Gandhi Jayanti
  '2026-10-14', // Dussehra
  '2026-11-02', // Diwali
  '2026-11-15', // Guru Nanak Jayanti
  '2026-12-25', // Christmas
];

export const CLINIC_CLOSURES: Record<string, string[]> = {
  'Kurukshetra': ['2026-07-15'],
  'Panipat':     ['2026-07-15', '2026-07-16'],
  'Shimla':      ['2026-09-10', '2026-09-11'],
  'Una':         ['2026-08-20'],
  'Deoria':      ['2026-08-20', '2026-08-21'],
};

export const DOCTOR_UNAVAILABLE: Record<string, string[]> = {
  'd1': ['2026-07-01', '2026-07-02', '2026-07-03'],
  'd2': ['2026-08-10', '2026-08-11'],
  'd3': ['2026-09-20', '2026-09-21'],
  'd4': ['2026-07-25', '2026-07-26', '2026-07-27'],
};

export function getFollowUpDateConstraintError(date: string, center: string, doctorId: string): string | null {
  if (CLINIC_HOLIDAYS.includes(date))                        return 'This date is a public holiday';
  if ((CLINIC_CLOSURES[center] ?? []).includes(date))        return 'Clinic is closed on this date';
  if ((DOCTOR_UNAVAILABLE[doctorId] ?? []).includes(date))   return 'Doctor is unavailable on this date';
  return null;
}

export interface VisitAlert {
  id:        string;
  patientId: string;
  alertType: string;
  dueDate:   string;
}

const today = new Date().toISOString().split('T')[0];

function relDate(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

export const mockVisitAlerts: VisitAlert[] = [
  { id: 'va1', patientId: 'p1', alertType: 'Next Treatment Cycle Due',  dueDate: relDate(0)  },
  { id: 'va2', patientId: 'p3', alertType: 'Post Treatment Review Due', dueDate: relDate(1)  },
  { id: 'va3', patientId: 'p4', alertType: 'Follow-Up Due',             dueDate: relDate(0)  },
  { id: 'va4', patientId: 'p7', alertType: 'Chemo Session Due',         dueDate: relDate(2)  },
  { id: 'va5', patientId: 'p9', alertType: 'Lab Results Review',        dueDate: relDate(-1) },
  { id: 'va6', patientId: 'p2', alertType: 'Next Treatment Cycle Due',  dueDate: relDate(3)  },
  { id: 'va7', patientId: 'p5', alertType: 'Follow-Up Due',             dueDate: relDate(4)  },
  { id: 'va8', patientId: 'p8', alertType: 'Post Treatment Review Due', dueDate: relDate(5)  },
];

function vId(center: string, seq: number): string {
  return generateVisitId(center, today, seq);
}

function vIdDate(center: string, date: string, seq: number): string {
  return generateVisitId(center, date, seq);
}

export const mockAppointments: Appointment[] = [

  // ── KURUKSHETRA — 50 appointments (d1) ───────────────────────────────────
  // Today (10)
  { id: 'a001', visitId: vId('Kurukshetra',  1), patientId: 'p1',  doctorId: 'd1', date: today,     time: '08:00', type: 'initial-visit',        status: 'confirmed',               center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a002', visitId: vId('Kurukshetra',  2), patientId: 'p2',  doctorId: 'd1', date: today,     time: '08:30', type: 'chemo-session',         status: 'chemo-auth-pending',      center: 'Kurukshetra', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a003', visitId: vId('Kurukshetra',  3), patientId: 'p3',  doctorId: 'd1', date: today,     time: '09:00', type: 'follow-up',             status: 'vitals-recorded',         center: 'Kurukshetra', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a004', visitId: vId('Kurukshetra',  4), patientId: 'p4',  doctorId: 'd1', date: today,     time: '09:30', type: 'chemo-session',         status: 'in-progress',             center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pre-auth' },
  { id: 'a005', visitId: vId('Kurukshetra',  5), patientId: 'p5',  doctorId: 'd1', date: today,     time: '10:00', type: 'regular-visit',         status: 'vitals-in-progress',      center: 'Kurukshetra', paymentType: 'government', paymentStatus: 'pre-auth' },
  { id: 'a006', visitId: vId('Kurukshetra',  6), patientId: 'p6',  doctorId: 'd1', date: today,     time: '10:30', type: 'follow-up-free',        status: 'completed',               center: 'Kurukshetra', paymentType: 'insurance',  paymentStatus: 'waived'   },
  { id: 'a007', visitId: vId('Kurukshetra',  7), patientId: 'p7',  doctorId: 'd1', date: today,     time: '11:00', type: 'chemo-session',         status: 'chemo-auth-pending',      center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pre-auth' },
  { id: 'a008', visitId: vId('Kurukshetra',  8), patientId: 'p8',  doctorId: 'd1', date: today,     time: '11:30', type: 'post-chemo-follow-up',  status: 'consult-in-progress',     center: 'Kurukshetra', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a009', visitId: vId('Kurukshetra',  9), patientId: 'p9',  doctorId: 'd1', date: today,     time: '14:00', type: 'initial-visit',         status: 'staging-in-progress',     center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a010', visitId: vId('Kurukshetra', 10), patientId: 'p10', doctorId: 'd1', date: today,     time: '14:30', type: 'follow-up',             status: 'deciding-treatment-plan', center: 'Kurukshetra', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  // Day +1 (8)
  { id: 'a011', visitId: vIdDate('Kurukshetra', relDate(1), 1), patientId: 'p11', doctorId: 'd1', date: relDate(1), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a012', visitId: vIdDate('Kurukshetra', relDate(1), 2), patientId: 'p12', doctorId: 'd1', date: relDate(1), time: '08:30', type: 'chemo-session',        status: 'confirmed', center: 'Kurukshetra', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a013', visitId: vIdDate('Kurukshetra', relDate(1), 3), patientId: 'p1',  doctorId: 'd1', date: relDate(1), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a014', visitId: vIdDate('Kurukshetra', relDate(1), 4), patientId: 'p2',  doctorId: 'd1', date: relDate(1), time: '09:30', type: 'follow-up',            status: 'confirmed', center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a015', visitId: vIdDate('Kurukshetra', relDate(1), 5), patientId: 'p3',  doctorId: 'd1', date: relDate(1), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a016', visitId: vIdDate('Kurukshetra', relDate(1), 6), patientId: 'p4',  doctorId: 'd1', date: relDate(1), time: '10:30', type: 'follow-up-free',       status: 'confirmed', center: 'Kurukshetra', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a017', visitId: vIdDate('Kurukshetra', relDate(1), 7), patientId: 'p5',  doctorId: 'd1', date: relDate(1), time: '11:00', type: 'post-chemo-follow-up', status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a018', visitId: vIdDate('Kurukshetra', relDate(1), 8), patientId: 'p6',  doctorId: 'd1', date: relDate(1), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  // Day +2 (8)
  { id: 'a019', visitId: vIdDate('Kurukshetra', relDate(2), 1), patientId: 'p7',  doctorId: 'd1', date: relDate(2), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a020', visitId: vIdDate('Kurukshetra', relDate(2), 2), patientId: 'p8',  doctorId: 'd1', date: relDate(2), time: '08:30', type: 'chemo-session',        status: 'confirmed', center: 'Kurukshetra', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a021', visitId: vIdDate('Kurukshetra', relDate(2), 3), patientId: 'p9',  doctorId: 'd1', date: relDate(2), time: '09:00', type: 'follow-up',            status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a022', visitId: vIdDate('Kurukshetra', relDate(2), 4), patientId: 'p10', doctorId: 'd1', date: relDate(2), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Kurukshetra', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a023', visitId: vIdDate('Kurukshetra', relDate(2), 5), patientId: 'p11', doctorId: 'd1', date: relDate(2), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a024', visitId: vIdDate('Kurukshetra', relDate(2), 6), patientId: 'p12', doctorId: 'd1', date: relDate(2), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a025', visitId: vIdDate('Kurukshetra', relDate(2), 7), patientId: 'p1',  doctorId: 'd1', date: relDate(2), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a026', visitId: vIdDate('Kurukshetra', relDate(2), 8), patientId: 'p2',  doctorId: 'd1', date: relDate(2), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Kurukshetra' },
  // Day +3 (8)
  { id: 'a027', visitId: vIdDate('Kurukshetra', relDate(3), 1), patientId: 'p3',  doctorId: 'd1', date: relDate(3), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a028', visitId: vIdDate('Kurukshetra', relDate(3), 2), patientId: 'p4',  doctorId: 'd1', date: relDate(3), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Kurukshetra', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a029', visitId: vIdDate('Kurukshetra', relDate(3), 3), patientId: 'p5',  doctorId: 'd1', date: relDate(3), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a030', visitId: vIdDate('Kurukshetra', relDate(3), 4), patientId: 'p6',  doctorId: 'd1', date: relDate(3), time: '09:30', type: 'initial-visit',        status: 'confirmed', center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a031', visitId: vIdDate('Kurukshetra', relDate(3), 5), patientId: 'p7',  doctorId: 'd1', date: relDate(3), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a032', visitId: vIdDate('Kurukshetra', relDate(3), 6), patientId: 'p8',  doctorId: 'd1', date: relDate(3), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Kurukshetra', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a033', visitId: vIdDate('Kurukshetra', relDate(3), 7), patientId: 'p9',  doctorId: 'd1', date: relDate(3), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a034', visitId: vIdDate('Kurukshetra', relDate(3), 8), patientId: 'p10', doctorId: 'd1', date: relDate(3), time: '14:00', type: 'regular-visit',        status: 'scheduled', center: 'Kurukshetra' },
  // Day +4 (8)
  { id: 'a035', visitId: vIdDate('Kurukshetra', relDate(4), 1), patientId: 'p11', doctorId: 'd1', date: relDate(4), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a036', visitId: vIdDate('Kurukshetra', relDate(4), 2), patientId: 'p12', doctorId: 'd1', date: relDate(4), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Kurukshetra', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a037', visitId: vIdDate('Kurukshetra', relDate(4), 3), patientId: 'p1',  doctorId: 'd1', date: relDate(4), time: '09:00', type: 'initial-visit',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a038', visitId: vIdDate('Kurukshetra', relDate(4), 4), patientId: 'p2',  doctorId: 'd1', date: relDate(4), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a039', visitId: vIdDate('Kurukshetra', relDate(4), 5), patientId: 'p3',  doctorId: 'd1', date: relDate(4), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a040', visitId: vIdDate('Kurukshetra', relDate(4), 6), patientId: 'p4',  doctorId: 'd1', date: relDate(4), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Kurukshetra', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a041', visitId: vIdDate('Kurukshetra', relDate(4), 7), patientId: 'p5',  doctorId: 'd1', date: relDate(4), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a042', visitId: vIdDate('Kurukshetra', relDate(4), 8), patientId: 'p6',  doctorId: 'd1', date: relDate(4), time: '14:00', type: 'regular-visit',        status: 'scheduled', center: 'Kurukshetra' },
  // Day +5 (8)
  { id: 'a043', visitId: vIdDate('Kurukshetra', relDate(5), 1), patientId: 'p7',  doctorId: 'd1', date: relDate(5), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a044', visitId: vIdDate('Kurukshetra', relDate(5), 2), patientId: 'p8',  doctorId: 'd1', date: relDate(5), time: '08:30', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a045', visitId: vIdDate('Kurukshetra', relDate(5), 3), patientId: 'p9',  doctorId: 'd1', date: relDate(5), time: '09:00', type: 'follow-up',            status: 'confirmed', center: 'Kurukshetra', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a046', visitId: vIdDate('Kurukshetra', relDate(5), 4), patientId: 'p10', doctorId: 'd1', date: relDate(5), time: '09:30', type: 'regular-visit',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a047', visitId: vIdDate('Kurukshetra', relDate(5), 5), patientId: 'p11', doctorId: 'd1', date: relDate(5), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a048', visitId: vIdDate('Kurukshetra', relDate(5), 6), patientId: 'p12', doctorId: 'd1', date: relDate(5), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Kurukshetra', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a049', visitId: vIdDate('Kurukshetra', relDate(5), 7), patientId: 'p1',  doctorId: 'd1', date: relDate(5), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Kurukshetra' },
  { id: 'a050', visitId: vIdDate('Kurukshetra', relDate(5), 8), patientId: 'p2',  doctorId: 'd1', date: relDate(5), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Kurukshetra' },

  // ── PANIPAT — 50 appointments (d2) ───────────────────────────────────────
  // Today (10)
  { id: 'a051', visitId: vId('Panipat',  1), patientId: 'p11', doctorId: 'd2', date: today, time: '08:00', type: 'initial-visit',        status: 'confirmed',               center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a052', visitId: vId('Panipat',  2), patientId: 'p12', doctorId: 'd2', date: today, time: '08:30', type: 'chemo-session',         status: 'checked-in',              center: 'Panipat', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a053', visitId: vId('Panipat',  3), patientId: 'p1',  doctorId: 'd2', date: today, time: '09:00', type: 'regular-visit',         status: 'vitals-in-progress',      center: 'Panipat', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a054', visitId: vId('Panipat',  4), patientId: 'p2',  doctorId: 'd2', date: today, time: '09:30', type: 'initial-visit',         status: 'deciding-treatment-plan', center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a055', visitId: vId('Panipat',  5), patientId: 'p3',  doctorId: 'd2', date: today, time: '10:00', type: 'chemo-session',         status: 'chemo-checklist-in-progress', center: 'Panipat', paymentType: 'government', paymentStatus: 'pre-auth' },
  { id: 'a056', visitId: vId('Panipat',  6), patientId: 'p4',  doctorId: 'd2', date: today, time: '10:30', type: 'chemo-session',         status: 'waiting-chair-assignment', center: 'Panipat', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a057', visitId: vId('Panipat',  7), patientId: 'p5',  doctorId: 'd2', date: today, time: '11:00', type: 'chemo-session',         status: 'chair-assigned',          center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pre-auth' },
  { id: 'a058', visitId: vId('Panipat',  8), patientId: 'p6',  doctorId: 'd2', date: today, time: '11:30', type: 'post-chemo-follow-up',  status: 'completed',               center: 'Panipat', paymentType: 'corporate',  paymentStatus: 'paid'     },
  { id: 'a059', visitId: vId('Panipat',  9), patientId: 'p7',  doctorId: 'd2', date: today, time: '14:00', type: 'chemo-session',         status: 'cancelled',               center: 'Panipat', cancellationReason: 'Patient requested rescheduling' },
  { id: 'a060', visitId: vId('Panipat', 10), patientId: 'p8',  doctorId: 'd2', date: today, time: '14:30', type: 'chemo-session',         status: 'in-progress',             center: 'Panipat', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  // Day +1 (8)
  { id: 'a061', visitId: vIdDate('Panipat', relDate(1), 1), patientId: 'p9',  doctorId: 'd2', date: relDate(1), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a062', visitId: vIdDate('Panipat', relDate(1), 2), patientId: 'p10', doctorId: 'd2', date: relDate(1), time: '08:30', type: 'initial-visit',        status: 'confirmed', center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a063', visitId: vIdDate('Panipat', relDate(1), 3), patientId: 'p11', doctorId: 'd2', date: relDate(1), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Panipat' },
  { id: 'a064', visitId: vIdDate('Panipat', relDate(1), 4), patientId: 'p12', doctorId: 'd2', date: relDate(1), time: '09:30', type: 'follow-up',            status: 'confirmed', center: 'Panipat', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a065', visitId: vIdDate('Panipat', relDate(1), 5), patientId: 'p1',  doctorId: 'd2', date: relDate(1), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a066', visitId: vIdDate('Panipat', relDate(1), 6), patientId: 'p2',  doctorId: 'd2', date: relDate(1), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Panipat', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a067', visitId: vIdDate('Panipat', relDate(1), 7), patientId: 'p3',  doctorId: 'd2', date: relDate(1), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Panipat' },
  { id: 'a068', visitId: vIdDate('Panipat', relDate(1), 8), patientId: 'p4',  doctorId: 'd2', date: relDate(1), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  // Day +2 (8)
  { id: 'a069', visitId: vIdDate('Panipat', relDate(2), 1), patientId: 'p5',  doctorId: 'd2', date: relDate(2), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Panipat' },
  { id: 'a070', visitId: vIdDate('Panipat', relDate(2), 2), patientId: 'p6',  doctorId: 'd2', date: relDate(2), time: '08:30', type: 'chemo-session',        status: 'confirmed', center: 'Panipat', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a071', visitId: vIdDate('Panipat', relDate(2), 3), patientId: 'p7',  doctorId: 'd2', date: relDate(2), time: '09:00', type: 'follow-up',            status: 'scheduled', center: 'Panipat' },
  { id: 'a072', visitId: vIdDate('Panipat', relDate(2), 4), patientId: 'p8',  doctorId: 'd2', date: relDate(2), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a073', visitId: vIdDate('Panipat', relDate(2), 5), patientId: 'p9',  doctorId: 'd2', date: relDate(2), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a074', visitId: vIdDate('Panipat', relDate(2), 6), patientId: 'p10', doctorId: 'd2', date: relDate(2), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Panipat', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a075', visitId: vIdDate('Panipat', relDate(2), 7), patientId: 'p11', doctorId: 'd2', date: relDate(2), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Panipat' },
  { id: 'a076', visitId: vIdDate('Panipat', relDate(2), 8), patientId: 'p12', doctorId: 'd2', date: relDate(2), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Panipat' },
  // Day +3 (8)
  { id: 'a077', visitId: vIdDate('Panipat', relDate(3), 1), patientId: 'p1',  doctorId: 'd2', date: relDate(3), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a078', visitId: vIdDate('Panipat', relDate(3), 2), patientId: 'p2',  doctorId: 'd2', date: relDate(3), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Panipat', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a079', visitId: vIdDate('Panipat', relDate(3), 3), patientId: 'p3',  doctorId: 'd2', date: relDate(3), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Panipat' },
  { id: 'a080', visitId: vIdDate('Panipat', relDate(3), 4), patientId: 'p4',  doctorId: 'd2', date: relDate(3), time: '09:30', type: 'initial-visit',        status: 'confirmed', center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a081', visitId: vIdDate('Panipat', relDate(3), 5), patientId: 'p5',  doctorId: 'd2', date: relDate(3), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a082', visitId: vIdDate('Panipat', relDate(3), 6), patientId: 'p6',  doctorId: 'd2', date: relDate(3), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Panipat', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a083', visitId: vIdDate('Panipat', relDate(3), 7), patientId: 'p7',  doctorId: 'd2', date: relDate(3), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Panipat' },
  { id: 'a084', visitId: vIdDate('Panipat', relDate(3), 8), patientId: 'p8',  doctorId: 'd2', date: relDate(3), time: '14:00', type: 'regular-visit',        status: 'scheduled', center: 'Panipat' },
  // Day +4 (8)
  { id: 'a085', visitId: vIdDate('Panipat', relDate(4), 1), patientId: 'p9',  doctorId: 'd2', date: relDate(4), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a086', visitId: vIdDate('Panipat', relDate(4), 2), patientId: 'p10', doctorId: 'd2', date: relDate(4), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Panipat', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a087', visitId: vIdDate('Panipat', relDate(4), 3), patientId: 'p11', doctorId: 'd2', date: relDate(4), time: '09:00', type: 'initial-visit',        status: 'scheduled', center: 'Panipat' },
  { id: 'a088', visitId: vIdDate('Panipat', relDate(4), 4), patientId: 'p12', doctorId: 'd2', date: relDate(4), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a089', visitId: vIdDate('Panipat', relDate(4), 5), patientId: 'p1',  doctorId: 'd2', date: relDate(4), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a090', visitId: vIdDate('Panipat', relDate(4), 6), patientId: 'p2',  doctorId: 'd2', date: relDate(4), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Panipat', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a091', visitId: vIdDate('Panipat', relDate(4), 7), patientId: 'p3',  doctorId: 'd2', date: relDate(4), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Panipat' },
  { id: 'a092', visitId: vIdDate('Panipat', relDate(4), 8), patientId: 'p4',  doctorId: 'd2', date: relDate(4), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  // Day +5 (8)
  { id: 'a093', visitId: vIdDate('Panipat', relDate(5), 1), patientId: 'p5',  doctorId: 'd2', date: relDate(5), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Panipat' },
  { id: 'a094', visitId: vIdDate('Panipat', relDate(5), 2), patientId: 'p6',  doctorId: 'd2', date: relDate(5), time: '08:30', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a095', visitId: vIdDate('Panipat', relDate(5), 3), patientId: 'p7',  doctorId: 'd2', date: relDate(5), time: '09:00', type: 'follow-up',            status: 'confirmed', center: 'Panipat', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a096', visitId: vIdDate('Panipat', relDate(5), 4), patientId: 'p8',  doctorId: 'd2', date: relDate(5), time: '09:30', type: 'regular-visit',        status: 'scheduled', center: 'Panipat' },
  { id: 'a097', visitId: vIdDate('Panipat', relDate(5), 5), patientId: 'p9',  doctorId: 'd2', date: relDate(5), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Panipat' },
  { id: 'a098', visitId: vIdDate('Panipat', relDate(5), 6), patientId: 'p10', doctorId: 'd2', date: relDate(5), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Panipat', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a099', visitId: vIdDate('Panipat', relDate(5), 7), patientId: 'p11', doctorId: 'd2', date: relDate(5), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Panipat' },
  { id: 'a100', visitId: vIdDate('Panipat', relDate(5), 8), patientId: 'p12', doctorId: 'd2', date: relDate(5), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Panipat' },

  // ── SHIMLA — 50 appointments (d3) ─────────────────────────────────────────
  // Today (10)
  { id: 'a101', visitId: vId('Shimla',  1), patientId: 'p9',  doctorId: 'd3', date: today, time: '08:00', type: 'initial-visit',        status: 'confirmed',               center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a102', visitId: vId('Shimla',  2), patientId: 'p10', doctorId: 'd3', date: today, time: '08:30', type: 'regular-visit',         status: 'vitals-recorded',         center: 'Shimla', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a103', visitId: vId('Shimla',  3), patientId: 'p11', doctorId: 'd3', date: today, time: '09:00', type: 'chemo-session',         status: 'in-progress',             center: 'Shimla', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a104', visitId: vId('Shimla',  4), patientId: 'p12', doctorId: 'd3', date: today, time: '09:30', type: 'initial-visit',         status: 'staging-in-progress',     center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a105', visitId: vId('Shimla',  5), patientId: 'p1',  doctorId: 'd3', date: today, time: '10:00', type: 'chemo-session',         status: 'chemo-auth-pending',      center: 'Shimla', paymentType: 'government', paymentStatus: 'pre-auth' },
  { id: 'a106', visitId: vId('Shimla',  6), patientId: 'p2',  doctorId: 'd3', date: today, time: '10:30', type: 'follow-up',             status: 'consult-in-progress',     center: 'Shimla', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a107', visitId: vId('Shimla',  7), patientId: 'p3',  doctorId: 'd3', date: today, time: '11:00', type: 'follow-up-free',        status: 'completed',               center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'paid'     },
  { id: 'a108', visitId: vId('Shimla',  8), patientId: 'p4',  doctorId: 'd3', date: today, time: '11:30', type: 'chemo-session',         status: 'chemo-auth-pending',      center: 'Shimla', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a109', visitId: vId('Shimla',  9), patientId: 'p5',  doctorId: 'd3', date: today, time: '14:00', type: 'chemo-session',         status: 'chair-assigned',          center: 'Shimla', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a110', visitId: vId('Shimla', 10), patientId: 'p6',  doctorId: 'd3', date: today, time: '14:30', type: 'chemo-session',         status: 'cancelled',               center: 'Shimla', cancellationReason: 'Patient travel issue' },
  // Day +1 (8)
  { id: 'a111', visitId: vIdDate('Shimla', relDate(1), 1), patientId: 'p7',  doctorId: 'd3', date: relDate(1), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a112', visitId: vIdDate('Shimla', relDate(1), 2), patientId: 'p8',  doctorId: 'd3', date: relDate(1), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a113', visitId: vIdDate('Shimla', relDate(1), 3), patientId: 'p9',  doctorId: 'd3', date: relDate(1), time: '09:00', type: 'initial-visit',        status: 'scheduled', center: 'Shimla' },
  { id: 'a114', visitId: vIdDate('Shimla', relDate(1), 4), patientId: 'p10', doctorId: 'd3', date: relDate(1), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Shimla', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a115', visitId: vIdDate('Shimla', relDate(1), 5), patientId: 'p11', doctorId: 'd3', date: relDate(1), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a116', visitId: vIdDate('Shimla', relDate(1), 6), patientId: 'p12', doctorId: 'd3', date: relDate(1), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Shimla', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a117', visitId: vIdDate('Shimla', relDate(1), 7), patientId: 'p1',  doctorId: 'd3', date: relDate(1), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Shimla' },
  { id: 'a118', visitId: vIdDate('Shimla', relDate(1), 8), patientId: 'p2',  doctorId: 'd3', date: relDate(1), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  // Day +2 (8)
  { id: 'a119', visitId: vIdDate('Shimla', relDate(2), 1), patientId: 'p3',  doctorId: 'd3', date: relDate(2), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Shimla' },
  { id: 'a120', visitId: vIdDate('Shimla', relDate(2), 2), patientId: 'p4',  doctorId: 'd3', date: relDate(2), time: '08:30', type: 'chemo-session',        status: 'confirmed', center: 'Shimla', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a121', visitId: vIdDate('Shimla', relDate(2), 3), patientId: 'p5',  doctorId: 'd3', date: relDate(2), time: '09:00', type: 'follow-up',            status: 'scheduled', center: 'Shimla' },
  { id: 'a122', visitId: vIdDate('Shimla', relDate(2), 4), patientId: 'p6',  doctorId: 'd3', date: relDate(2), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a123', visitId: vIdDate('Shimla', relDate(2), 5), patientId: 'p7',  doctorId: 'd3', date: relDate(2), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a124', visitId: vIdDate('Shimla', relDate(2), 6), patientId: 'p8',  doctorId: 'd3', date: relDate(2), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Shimla', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a125', visitId: vIdDate('Shimla', relDate(2), 7), patientId: 'p9',  doctorId: 'd3', date: relDate(2), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Shimla' },
  { id: 'a126', visitId: vIdDate('Shimla', relDate(2), 8), patientId: 'p10', doctorId: 'd3', date: relDate(2), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Shimla' },
  // Day +3 (8)
  { id: 'a127', visitId: vIdDate('Shimla', relDate(3), 1), patientId: 'p11', doctorId: 'd3', date: relDate(3), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a128', visitId: vIdDate('Shimla', relDate(3), 2), patientId: 'p12', doctorId: 'd3', date: relDate(3), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Shimla', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a129', visitId: vIdDate('Shimla', relDate(3), 3), patientId: 'p1',  doctorId: 'd3', date: relDate(3), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Shimla' },
  { id: 'a130', visitId: vIdDate('Shimla', relDate(3), 4), patientId: 'p2',  doctorId: 'd3', date: relDate(3), time: '09:30', type: 'initial-visit',        status: 'confirmed', center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a131', visitId: vIdDate('Shimla', relDate(3), 5), patientId: 'p3',  doctorId: 'd3', date: relDate(3), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a132', visitId: vIdDate('Shimla', relDate(3), 6), patientId: 'p4',  doctorId: 'd3', date: relDate(3), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Shimla', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a133', visitId: vIdDate('Shimla', relDate(3), 7), patientId: 'p5',  doctorId: 'd3', date: relDate(3), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Shimla' },
  { id: 'a134', visitId: vIdDate('Shimla', relDate(3), 8), patientId: 'p6',  doctorId: 'd3', date: relDate(3), time: '14:00', type: 'regular-visit',        status: 'scheduled', center: 'Shimla' },
  // Day +4 (8)
  { id: 'a135', visitId: vIdDate('Shimla', relDate(4), 1), patientId: 'p7',  doctorId: 'd3', date: relDate(4), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a136', visitId: vIdDate('Shimla', relDate(4), 2), patientId: 'p8',  doctorId: 'd3', date: relDate(4), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Shimla', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a137', visitId: vIdDate('Shimla', relDate(4), 3), patientId: 'p9',  doctorId: 'd3', date: relDate(4), time: '09:00', type: 'initial-visit',        status: 'scheduled', center: 'Shimla' },
  { id: 'a138', visitId: vIdDate('Shimla', relDate(4), 4), patientId: 'p10', doctorId: 'd3', date: relDate(4), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a139', visitId: vIdDate('Shimla', relDate(4), 5), patientId: 'p11', doctorId: 'd3', date: relDate(4), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a140', visitId: vIdDate('Shimla', relDate(4), 6), patientId: 'p12', doctorId: 'd3', date: relDate(4), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Shimla', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a141', visitId: vIdDate('Shimla', relDate(4), 7), patientId: 'p1',  doctorId: 'd3', date: relDate(4), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Shimla' },
  { id: 'a142', visitId: vIdDate('Shimla', relDate(4), 8), patientId: 'p2',  doctorId: 'd3', date: relDate(4), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  // Day +5 (8)
  { id: 'a143', visitId: vIdDate('Shimla', relDate(5), 1), patientId: 'p3',  doctorId: 'd3', date: relDate(5), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Shimla' },
  { id: 'a144', visitId: vIdDate('Shimla', relDate(5), 2), patientId: 'p4',  doctorId: 'd3', date: relDate(5), time: '08:30', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a145', visitId: vIdDate('Shimla', relDate(5), 3), patientId: 'p5',  doctorId: 'd3', date: relDate(5), time: '09:00', type: 'follow-up',            status: 'confirmed', center: 'Shimla', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a146', visitId: vIdDate('Shimla', relDate(5), 4), patientId: 'p6',  doctorId: 'd3', date: relDate(5), time: '09:30', type: 'regular-visit',        status: 'scheduled', center: 'Shimla' },
  { id: 'a147', visitId: vIdDate('Shimla', relDate(5), 5), patientId: 'p7',  doctorId: 'd3', date: relDate(5), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Shimla' },
  { id: 'a148', visitId: vIdDate('Shimla', relDate(5), 6), patientId: 'p8',  doctorId: 'd3', date: relDate(5), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Shimla', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a149', visitId: vIdDate('Shimla', relDate(5), 7), patientId: 'p9',  doctorId: 'd3', date: relDate(5), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Shimla' },
  { id: 'a150', visitId: vIdDate('Shimla', relDate(5), 8), patientId: 'p10', doctorId: 'd3', date: relDate(5), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Shimla' },

  // ── UNA — 50 appointments (d4) ────────────────────────────────────────────
  // Today (10)
  { id: 'a151', visitId: vId('Una',  1), patientId: 'p7',  doctorId: 'd4', date: today, time: '08:00', type: 'initial-visit',        status: 'confirmed',               center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a152', visitId: vId('Una',  2), patientId: 'p8',  doctorId: 'd4', date: today, time: '08:30', type: 'regular-visit',         status: 'checked-in',              center: 'Una', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a153', visitId: vId('Una',  3), patientId: 'p9',  doctorId: 'd4', date: today, time: '09:00', type: 'chemo-session',         status: 'chemo-auth-rejected',     center: 'Una', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a154', visitId: vId('Una',  4), patientId: 'p10', doctorId: 'd4', date: today, time: '09:30', type: 'initial-visit',         status: 'deciding-treatment-plan', center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a155', visitId: vId('Una',  5), patientId: 'p11', doctorId: 'd4', date: today, time: '10:00', type: 'regular-visit',         status: 'vitals-in-progress',      center: 'Una', paymentType: 'government', paymentStatus: 'pre-auth' },
  { id: 'a156', visitId: vId('Una',  6), patientId: 'p12', doctorId: 'd4', date: today, time: '10:30', type: 'follow-up-free',        status: 'completed',               center: 'Una', paymentType: 'insurance',  paymentStatus: 'waived'   },
  { id: 'a157', visitId: vId('Una',  7), patientId: 'p1',  doctorId: 'd4', date: today, time: '11:00', type: 'post-chemo-follow-up',  status: 'consult-in-progress',     center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pre-auth' },
  { id: 'a158', visitId: vId('Una',  8), patientId: 'p2',  doctorId: 'd4', date: today, time: '11:30', type: 'chemo-session',         status: 'waiting-chair-assignment', center: 'Una', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a159', visitId: vId('Una',  9), patientId: 'p3',  doctorId: 'd4', date: today, time: '14:00', type: 'chemo-session',         status: 'chemo-checklist-in-progress', center: 'Una', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a160', visitId: vId('Una', 10), patientId: 'p4',  doctorId: 'd4', date: today, time: '14:30', type: 'chemo-session',         status: 'in-progress',             center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pre-auth' },
  // Day +1 (8)
  { id: 'a161', visitId: vIdDate('Una', relDate(1), 1), patientId: 'p5',  doctorId: 'd4', date: relDate(1), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a162', visitId: vIdDate('Una', relDate(1), 2), patientId: 'p6',  doctorId: 'd4', date: relDate(1), time: '08:30', type: 'initial-visit',        status: 'confirmed', center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a163', visitId: vIdDate('Una', relDate(1), 3), patientId: 'p7',  doctorId: 'd4', date: relDate(1), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Una' },
  { id: 'a164', visitId: vIdDate('Una', relDate(1), 4), patientId: 'p8',  doctorId: 'd4', date: relDate(1), time: '09:30', type: 'follow-up',            status: 'confirmed', center: 'Una', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a165', visitId: vIdDate('Una', relDate(1), 5), patientId: 'p9',  doctorId: 'd4', date: relDate(1), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a166', visitId: vIdDate('Una', relDate(1), 6), patientId: 'p10', doctorId: 'd4', date: relDate(1), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Una', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a167', visitId: vIdDate('Una', relDate(1), 7), patientId: 'p11', doctorId: 'd4', date: relDate(1), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Una' },
  { id: 'a168', visitId: vIdDate('Una', relDate(1), 8), patientId: 'p12', doctorId: 'd4', date: relDate(1), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  // Day +2 (8)
  { id: 'a169', visitId: vIdDate('Una', relDate(2), 1), patientId: 'p1',  doctorId: 'd4', date: relDate(2), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Una' },
  { id: 'a170', visitId: vIdDate('Una', relDate(2), 2), patientId: 'p2',  doctorId: 'd4', date: relDate(2), time: '08:30', type: 'chemo-session',        status: 'confirmed', center: 'Una', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a171', visitId: vIdDate('Una', relDate(2), 3), patientId: 'p3',  doctorId: 'd4', date: relDate(2), time: '09:00', type: 'follow-up',            status: 'scheduled', center: 'Una' },
  { id: 'a172', visitId: vIdDate('Una', relDate(2), 4), patientId: 'p4',  doctorId: 'd4', date: relDate(2), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a173', visitId: vIdDate('Una', relDate(2), 5), patientId: 'p5',  doctorId: 'd4', date: relDate(2), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a174', visitId: vIdDate('Una', relDate(2), 6), patientId: 'p6',  doctorId: 'd4', date: relDate(2), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Una', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a175', visitId: vIdDate('Una', relDate(2), 7), patientId: 'p7',  doctorId: 'd4', date: relDate(2), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Una' },
  { id: 'a176', visitId: vIdDate('Una', relDate(2), 8), patientId: 'p8',  doctorId: 'd4', date: relDate(2), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Una' },
  // Day +3 (8)
  { id: 'a177', visitId: vIdDate('Una', relDate(3), 1), patientId: 'p9',  doctorId: 'd4', date: relDate(3), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a178', visitId: vIdDate('Una', relDate(3), 2), patientId: 'p10', doctorId: 'd4', date: relDate(3), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Una', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a179', visitId: vIdDate('Una', relDate(3), 3), patientId: 'p11', doctorId: 'd4', date: relDate(3), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Una' },
  { id: 'a180', visitId: vIdDate('Una', relDate(3), 4), patientId: 'p12', doctorId: 'd4', date: relDate(3), time: '09:30', type: 'initial-visit',        status: 'confirmed', center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a181', visitId: vIdDate('Una', relDate(3), 5), patientId: 'p1',  doctorId: 'd4', date: relDate(3), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a182', visitId: vIdDate('Una', relDate(3), 6), patientId: 'p2',  doctorId: 'd4', date: relDate(3), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Una', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a183', visitId: vIdDate('Una', relDate(3), 7), patientId: 'p3',  doctorId: 'd4', date: relDate(3), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Una' },
  { id: 'a184', visitId: vIdDate('Una', relDate(3), 8), patientId: 'p4',  doctorId: 'd4', date: relDate(3), time: '14:00', type: 'regular-visit',        status: 'scheduled', center: 'Una' },
  // Day +4 (8)
  { id: 'a185', visitId: vIdDate('Una', relDate(4), 1), patientId: 'p5',  doctorId: 'd4', date: relDate(4), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a186', visitId: vIdDate('Una', relDate(4), 2), patientId: 'p6',  doctorId: 'd4', date: relDate(4), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Una', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a187', visitId: vIdDate('Una', relDate(4), 3), patientId: 'p7',  doctorId: 'd4', date: relDate(4), time: '09:00', type: 'initial-visit',        status: 'scheduled', center: 'Una' },
  { id: 'a188', visitId: vIdDate('Una', relDate(4), 4), patientId: 'p8',  doctorId: 'd4', date: relDate(4), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a189', visitId: vIdDate('Una', relDate(4), 5), patientId: 'p9',  doctorId: 'd4', date: relDate(4), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a190', visitId: vIdDate('Una', relDate(4), 6), patientId: 'p10', doctorId: 'd4', date: relDate(4), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Una', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a191', visitId: vIdDate('Una', relDate(4), 7), patientId: 'p11', doctorId: 'd4', date: relDate(4), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Una' },
  { id: 'a192', visitId: vIdDate('Una', relDate(4), 8), patientId: 'p12', doctorId: 'd4', date: relDate(4), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  // Day +5 (8)
  { id: 'a193', visitId: vIdDate('Una', relDate(5), 1), patientId: 'p1',  doctorId: 'd4', date: relDate(5), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Una' },
  { id: 'a194', visitId: vIdDate('Una', relDate(5), 2), patientId: 'p2',  doctorId: 'd4', date: relDate(5), time: '08:30', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a195', visitId: vIdDate('Una', relDate(5), 3), patientId: 'p3',  doctorId: 'd4', date: relDate(5), time: '09:00', type: 'follow-up',            status: 'confirmed', center: 'Una', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a196', visitId: vIdDate('Una', relDate(5), 4), patientId: 'p4',  doctorId: 'd4', date: relDate(5), time: '09:30', type: 'regular-visit',        status: 'scheduled', center: 'Una' },
  { id: 'a197', visitId: vIdDate('Una', relDate(5), 5), patientId: 'p5',  doctorId: 'd4', date: relDate(5), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Una' },
  { id: 'a198', visitId: vIdDate('Una', relDate(5), 6), patientId: 'p6',  doctorId: 'd4', date: relDate(5), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Una', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a199', visitId: vIdDate('Una', relDate(5), 7), patientId: 'p7',  doctorId: 'd4', date: relDate(5), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Una' },
  { id: 'a200', visitId: vIdDate('Una', relDate(5), 8), patientId: 'p8',  doctorId: 'd4', date: relDate(5), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Una' },

  // ── DEORIA — 50 appointments (d3) ─────────────────────────────────────────
  // Today (10)
  { id: 'a201', visitId: vId('Deoria',  1), patientId: 'p5',  doctorId: 'd3', date: today, time: '08:00', type: 'follow-up',             status: 'confirmed',           center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a202', visitId: vId('Deoria',  2), patientId: 'p6',  doctorId: 'd3', date: today, time: '08:30', type: 'regular-visit',          status: 'vitals-recorded',     center: 'Deoria', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a203', visitId: vId('Deoria',  3), patientId: 'p7',  doctorId: 'd3', date: today, time: '09:00', type: 'post-chemo-follow-up',   status: 'consult-in-progress', center: 'Deoria', paymentType: 'corporate',  paymentStatus: 'pre-auth' },
  { id: 'a204', visitId: vId('Deoria',  4), patientId: 'p8',  doctorId: 'd3', date: today, time: '09:30', type: 'initial-visit',          status: 'staging-in-progress', center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pending'  },
  { id: 'a205', visitId: vId('Deoria',  5), patientId: 'p9',  doctorId: 'd3', date: today, time: '10:00', type: 'chemo-session',          status: 'chemo-auth-pending',  center: 'Deoria', paymentType: 'government', paymentStatus: 'pre-auth' },
  { id: 'a206', visitId: vId('Deoria',  6), patientId: 'p10', doctorId: 'd3', date: today, time: '10:30', type: 'chemo-session',          status: 'chair-assigned',      center: 'Deoria', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a207', visitId: vId('Deoria',  7), patientId: 'p11', doctorId: 'd3', date: today, time: '11:00', type: 'chemo-session',          status: 'in-progress',         center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pre-auth' },
  { id: 'a208', visitId: vId('Deoria',  8), patientId: 'p12', doctorId: 'd3', date: today, time: '11:30', type: 'follow-up-free',         status: 'completed',           center: 'Deoria', paymentType: 'corporate',  paymentStatus: 'paid'     },
  { id: 'a209', visitId: vId('Deoria',  9), patientId: 'p1',  doctorId: 'd3', date: today, time: '14:00', type: 'chemo-session',          status: 'chemo-auth-pending',  center: 'Deoria', paymentType: 'insurance',  paymentStatus: 'pre-auth' },
  { id: 'a210', visitId: vId('Deoria', 10), patientId: 'p2',  doctorId: 'd3', date: today, time: '14:30', type: 'chemo-session',          status: 'cancelled',           center: 'Deoria', cancellationReason: 'Physician unavailable' },
  // Day +1 (8)
  { id: 'a211', visitId: vIdDate('Deoria', relDate(1), 1), patientId: 'p3',  doctorId: 'd3', date: relDate(1), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a212', visitId: vIdDate('Deoria', relDate(1), 2), patientId: 'p4',  doctorId: 'd3', date: relDate(1), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a213', visitId: vIdDate('Deoria', relDate(1), 3), patientId: 'p5',  doctorId: 'd3', date: relDate(1), time: '09:00', type: 'initial-visit',        status: 'scheduled', center: 'Deoria' },
  { id: 'a214', visitId: vIdDate('Deoria', relDate(1), 4), patientId: 'p6',  doctorId: 'd3', date: relDate(1), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Deoria', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a215', visitId: vIdDate('Deoria', relDate(1), 5), patientId: 'p7',  doctorId: 'd3', date: relDate(1), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a216', visitId: vIdDate('Deoria', relDate(1), 6), patientId: 'p8',  doctorId: 'd3', date: relDate(1), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Deoria', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a217', visitId: vIdDate('Deoria', relDate(1), 7), patientId: 'p9',  doctorId: 'd3', date: relDate(1), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Deoria' },
  { id: 'a218', visitId: vIdDate('Deoria', relDate(1), 8), patientId: 'p10', doctorId: 'd3', date: relDate(1), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  // Day +2 (8)
  { id: 'a219', visitId: vIdDate('Deoria', relDate(2), 1), patientId: 'p11', doctorId: 'd3', date: relDate(2), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Deoria' },
  { id: 'a220', visitId: vIdDate('Deoria', relDate(2), 2), patientId: 'p12', doctorId: 'd3', date: relDate(2), time: '08:30', type: 'chemo-session',        status: 'confirmed', center: 'Deoria', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a221', visitId: vIdDate('Deoria', relDate(2), 3), patientId: 'p1',  doctorId: 'd3', date: relDate(2), time: '09:00', type: 'follow-up',            status: 'scheduled', center: 'Deoria' },
  { id: 'a222', visitId: vIdDate('Deoria', relDate(2), 4), patientId: 'p2',  doctorId: 'd3', date: relDate(2), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a223', visitId: vIdDate('Deoria', relDate(2), 5), patientId: 'p3',  doctorId: 'd3', date: relDate(2), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a224', visitId: vIdDate('Deoria', relDate(2), 6), patientId: 'p4',  doctorId: 'd3', date: relDate(2), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Deoria', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a225', visitId: vIdDate('Deoria', relDate(2), 7), patientId: 'p5',  doctorId: 'd3', date: relDate(2), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Deoria' },
  { id: 'a226', visitId: vIdDate('Deoria', relDate(2), 8), patientId: 'p6',  doctorId: 'd3', date: relDate(2), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Deoria' },
  // Day +3 (8)
  { id: 'a227', visitId: vIdDate('Deoria', relDate(3), 1), patientId: 'p7',  doctorId: 'd3', date: relDate(3), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a228', visitId: vIdDate('Deoria', relDate(3), 2), patientId: 'p8',  doctorId: 'd3', date: relDate(3), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Deoria', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a229', visitId: vIdDate('Deoria', relDate(3), 3), patientId: 'p9',  doctorId: 'd3', date: relDate(3), time: '09:00', type: 'regular-visit',        status: 'scheduled', center: 'Deoria' },
  { id: 'a230', visitId: vIdDate('Deoria', relDate(3), 4), patientId: 'p10', doctorId: 'd3', date: relDate(3), time: '09:30', type: 'initial-visit',        status: 'confirmed', center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a231', visitId: vIdDate('Deoria', relDate(3), 5), patientId: 'p11', doctorId: 'd3', date: relDate(3), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a232', visitId: vIdDate('Deoria', relDate(3), 6), patientId: 'p12', doctorId: 'd3', date: relDate(3), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Deoria', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a233', visitId: vIdDate('Deoria', relDate(3), 7), patientId: 'p1',  doctorId: 'd3', date: relDate(3), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Deoria' },
  { id: 'a234', visitId: vIdDate('Deoria', relDate(3), 8), patientId: 'p2',  doctorId: 'd3', date: relDate(3), time: '14:00', type: 'regular-visit',        status: 'scheduled', center: 'Deoria' },
  // Day +4 (8)
  { id: 'a235', visitId: vIdDate('Deoria', relDate(4), 1), patientId: 'p3',  doctorId: 'd3', date: relDate(4), time: '08:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a236', visitId: vIdDate('Deoria', relDate(4), 2), patientId: 'p4',  doctorId: 'd3', date: relDate(4), time: '08:30', type: 'follow-up',            status: 'confirmed', center: 'Deoria', paymentType: 'government', paymentStatus: 'pending' },
  { id: 'a237', visitId: vIdDate('Deoria', relDate(4), 3), patientId: 'p5',  doctorId: 'd3', date: relDate(4), time: '09:00', type: 'initial-visit',        status: 'scheduled', center: 'Deoria' },
  { id: 'a238', visitId: vIdDate('Deoria', relDate(4), 4), patientId: 'p6',  doctorId: 'd3', date: relDate(4), time: '09:30', type: 'regular-visit',        status: 'confirmed', center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a239', visitId: vIdDate('Deoria', relDate(4), 5), patientId: 'p7',  doctorId: 'd3', date: relDate(4), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a240', visitId: vIdDate('Deoria', relDate(4), 6), patientId: 'p8',  doctorId: 'd3', date: relDate(4), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Deoria', paymentType: 'corporate',  paymentStatus: 'pending' },
  { id: 'a241', visitId: vIdDate('Deoria', relDate(4), 7), patientId: 'p9',  doctorId: 'd3', date: relDate(4), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Deoria' },
  { id: 'a242', visitId: vIdDate('Deoria', relDate(4), 8), patientId: 'p10', doctorId: 'd3', date: relDate(4), time: '14:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  // Day +5 (8)
  { id: 'a243', visitId: vIdDate('Deoria', relDate(5), 1), patientId: 'p11', doctorId: 'd3', date: relDate(5), time: '08:00', type: 'initial-visit',        status: 'scheduled', center: 'Deoria' },
  { id: 'a244', visitId: vIdDate('Deoria', relDate(5), 2), patientId: 'p12', doctorId: 'd3', date: relDate(5), time: '08:30', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a245', visitId: vIdDate('Deoria', relDate(5), 3), patientId: 'p1',  doctorId: 'd3', date: relDate(5), time: '09:00', type: 'follow-up',            status: 'confirmed', center: 'Deoria', paymentType: 'insurance',  paymentStatus: 'pending' },
  { id: 'a246', visitId: vIdDate('Deoria', relDate(5), 4), patientId: 'p2',  doctorId: 'd3', date: relDate(5), time: '09:30', type: 'regular-visit',        status: 'scheduled', center: 'Deoria' },
  { id: 'a247', visitId: vIdDate('Deoria', relDate(5), 5), patientId: 'p3',  doctorId: 'd3', date: relDate(5), time: '10:00', type: 'chemo-session',        status: 'scheduled', center: 'Deoria' },
  { id: 'a248', visitId: vIdDate('Deoria', relDate(5), 6), patientId: 'p4',  doctorId: 'd3', date: relDate(5), time: '10:30', type: 'post-chemo-follow-up', status: 'confirmed', center: 'Deoria', paymentType: 'self-pay',   paymentStatus: 'pending' },
  { id: 'a249', visitId: vIdDate('Deoria', relDate(5), 7), patientId: 'p5',  doctorId: 'd3', date: relDate(5), time: '11:00', type: 'follow-up-free',       status: 'scheduled', center: 'Deoria' },
  { id: 'a250', visitId: vIdDate('Deoria', relDate(5), 8), patientId: 'p6',  doctorId: 'd3', date: relDate(5), time: '14:00', type: 'initial-visit',        status: 'scheduled', center: 'Deoria' },
];
