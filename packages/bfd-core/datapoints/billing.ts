import { CENTER_INITIALS, generateVisitId } from './scheduling';
import type { AppointmentType, PaymentType, PaymentStatus, SelfPayMethod } from './scheduling';
import { badge } from 'bfd-themes';

export interface OutstandingPayment {
  center: string;
  amount: number;
}

export interface Invoice {
  id:                string;
  invoiceNumber:     string;
  appointmentId:     string;
  visitId:           string;
  patientId:         string;
  visitType:         AppointmentType;
  visitCharges:      number;
  additionalCharges: number;
  discount:          number;
  paymentType:       PaymentType;
  paymentStatus:     PaymentStatus;
  paymentMethod?:    SelfPayMethod;
  transactionId?:    string;
  createdAt:         string;
  center:            string;
  billingType:       'itemized' | 'package' | 'hybrid';
  claimId?:          string;
  paidAmount:        number;
  // Extended fields (Generate Invoice Overlay)
  careSetting?:      CareSetting;
  department?:       Department;
  invoiceStatus?:    InvoiceStatus;
  invoicePmtStatus?: InvoicePmtStatus;
  refundStatus?:     RefundStatus;
  lineItems?:        BillLineItem[];
  invoicePackage?:   InvoicePackage;
  draftPayments?:    DraftPaymentRow[];
  payorDetails?:     PayorDetails;
}

export const VISIT_CHARGES: Record<AppointmentType, number> = {
  'initial-visit':  1500,
  'regular-visit':   800,
  'follow-up':       500,
  'chemo-session':  5000,
  'follow-up-free':    0,
  'post-chemo-follow-up': 0,
};

export function generateInvoiceNumber(center: string, date: string, seq: number): string {
  const initials = CENTER_INITIALS[center] ?? center.slice(0, 3).toUpperCase();
  const [y, m, d] = date.split('-');
  return `INV-${initials}-${d}${m}${y.slice(2)}-${String(seq).padStart(3, '0')}`;
}

export function generateExpenseId(center: string, seq: number): string {
  const initials = CENTER_INITIALS[center] ?? center.slice(0, 3).toUpperCase();
  return `EX-${initials}-${String(seq).padStart(8, '0')}`;
}

export const mockOutstandingPayments: OutstandingPayment[] = [
  { center: 'Kurukshetra', amount: 85000 },
  { center: 'Panipat',     amount: 42000 },
  { center: 'Shimla',      amount: 67500 },
  { center: 'Una',         amount: 38000 },
  { center: 'Deoria',      amount: 12000 },
];

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

const today = new Date().toISOString().split('T')[0];

function vId(c: string, s: number)               { return generateVisitId(c, today, s); }
function vIdD(c: string, d: string, s: number)   { return generateVisitId(c, d, s); }
function invN(c: string, s: number)               { return generateInvoiceNumber(c, today, s); }
function invND(c: string, d: string, s: number)  { return generateInvoiceNumber(c, d, s); }

export const BILLING_TYPE_LABELS: Record<'itemized' | 'package' | 'hybrid', string> = {
  itemized: 'Itemized', package: 'Package', hybrid: 'Hybrid',
};

// ── Cost Estimation ───────────────────────────────────────────────────────────

export type CostCategory =
  | 'consultation' | 'chemotherapy' | 'pharmacy'      | 'diagnostics'
  | 'consumables'  | 'room'         | 'admin-file'    | 'nursing'
  | 'miscellaneous';

export const COST_CATEGORY_LABELS: Record<CostCategory, string> = {
  consultation:  'Consultation',
  chemotherapy:  'Drugs – Chemo',          // chemo drug costs billed to patient
  pharmacy:      'Drugs – Pharmacy (Pre-meds)',  // pre-medications / supportive drugs
  diagnostics:   'Investigation',
  consumables:   'Consumables',
  room:          'Bed Charges',
  'admin-file':  'Admin / File Charges',
  nursing:       'Nursing / Day-Care',
  miscellaneous: 'Miscellaneous',
};

export interface CostEstimateItem {
  id:          string;
  category:    CostCategory;
  description: string;
  unitCost:    number;
  quantity:    number;
  total:       number;
  notes?:      string;
}

export interface CostEstimate {
  id:            string;
  patientId:     string;
  planId?:       string;
  createdAt:     string;
  validTill?:    string;
  items:         CostEstimateItem[];
  totalEstimate: number;
  notes?:        string;
}

// ── Insurance Claims ──────────────────────────────────────────────────────────

export interface ClaimTimelineStep {
  step:         string;
  completedAt?: string;
  note?:        string;
  status:       'done' | 'current' | 'pending';
}

export type ClaimStatus =
  | 'submitted' | 'under-review' | 'approved'
  | 'partially-approved' | 'rejected' | 'appealed';

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  'submitted':          'Submitted',
  'under-review':       'Under Review',
  'approved':           'Approved',
  'partially-approved': 'Partially Approved',
  'rejected':           'Rejected',
  'appealed':           'Appeal',
};

export const CLAIM_STATUS_COLORS: Record<ClaimStatus, string> = {
  'submitted':          badge.info,
  'under-review':       badge.warning,
  'approved':           badge.success,
  'partially-approved': badge.teal,
  'rejected':           badge.destructive,
  'appealed':           badge.orange,
};

export type AuthorizationStatus = 'pending-auth' | 'pre-authorized' | 'authorized';

export const AUTH_STATUS_LABELS: Record<AuthorizationStatus, string> = {
  'pending-auth':   'Pending Authorization',
  'pre-authorized': 'Pre-Authorized',
  'authorized':     'Authorized',
};

export const AUTH_STATUS_COLORS: Record<AuthorizationStatus, string> = {
  'pending-auth':   badge.warning,
  'pre-authorized': badge.info,
  'authorized':     badge.success,
};

export interface InsuranceClaim {
  id:                   string;
  patientId:            string;
  invoiceId:            string;
  insurerName:          string;
  policyNumber:         string;
  claimNumber:          string;
  claimedAmount:        number;
  approvedAmount?:      number;
  status:               ClaimStatus;
  authorizationStatus?: AuthorizationStatus;
  // Two-tier payment tracking: Insurance → TPA → PO (Bharat Oncology)
  tpaReceivedDate?:    string;   // date TPA received funds from insurer
  tpaReceivedAmount?:  number;
  poReceivedDate?:     string;   // date PO (Bharat Oncology) received from TPA — clears AR
  poReceivedAmount?:   number;
  submittedDate:        string;
  settledDate?:         string;
  remarks?:             string;
  timeline:             ClaimTimelineStep[];
}

// ── Payment Records ───────────────────────────────────────────────────────────

export type PaymentMode =
  | 'cash' | 'upi' | 'card' | 'netbanking'
  | 'cheque' | 'insurance-transfer' | 'government-scheme';

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  'cash':               'Cash',
  'upi':                'UPI',
  'card':               'Card (Debit / Credit)',
  'netbanking':         'Net Banking',
  'cheque':             'Cheque',
  'insurance-transfer': 'Insurance Transfer',
  'government-scheme':  'Government Scheme',
};

export interface PaymentRecord {
  id:              string;
  patientId:       string;
  invoiceId:       string;
  amount:          number;
  mode:            PaymentMode;
  date:            string;
  transactionRef?: string;
  notes?:          string;
  recordedBy?:     string;
}

// ── Expenses ─────────────────────────────────────────────────────────────────

export type ExpenseCategory =
  | 'staff-salary' | 'utilities'   | 'equipment'    | 'consumables'
  | 'drugs'        | 'lab-supplies' | 'rent'         | 'marketing'
  | 'maintenance'  | 'miscellaneous';

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  'staff-salary':  'Staff Salary',
  'utilities':     'Utilities',
  'equipment':     'Equipment',
  'consumables':   'Consumables',
  'drugs':         'Drugs & Medications',
  'lab-supplies':  'Lab Supplies',
  'rent':          'Rent',
  'marketing':     'Marketing',
  'maintenance':   'Maintenance',
  'miscellaneous': 'Miscellaneous',
};

export interface Expense {
  id:          string;
  center:      string;
  date:        string;
  category:    ExpenseCategory;
  description: string;
  amount:      number;
  paidBy?:     string;
  receiptRef?: string;
}

// ── Invoice Builder Types ─────────────────────────────────────────────────────

export type CareSetting = 'opd' | 'ipd' | 'daycare';
export type Department  = 'chemo' | 'surgery' | 'radiation' | 'diagnostics';

export type InvoiceStatus    = 'draft' | 'finalized' | 'partially-paid' | 'paid' | 'cancelled';
export type InvoicePmtStatus = 'unpaid' | 'partially-paid' | 'paid' | 'waived';
export type PackageStatus    = 'active' | 'completed' | 'suspended' | 'cancelled';
export type PreAuthStatus    = 'not-required' | 'pending' | 'approved' | 'rejected';
export type RefundStatus     = 'none' | 'requested' | 'processed';

export const CARE_SETTING_LABELS: Record<CareSetting, string> = {
  opd:     'OPD',
  ipd:     'IPD',
  daycare: 'Daycare',
};

export const DEPARTMENT_LABELS: Record<Department, string> = {
  chemo:       'Chemo',
  surgery:     'Surgery',
  radiation:   'Radiation',
  diagnostics: 'Diagnostics',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  'draft':          'Draft',
  'finalized':      'Finalized',
  'partially-paid': 'Partially Paid',
  'paid':           'Paid',
  'cancelled':      'Cancelled',
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  'draft':          badge.warning,
  'finalized':      badge.info,
  'partially-paid': badge.teal,
  'paid':           badge.success,
  'cancelled':      badge.muted,
};

export const INVOICE_PMT_STATUS_LABELS: Record<InvoicePmtStatus, string> = {
  'unpaid':         'Unpaid',
  'partially-paid': 'Partially Paid',
  'paid':           'Paid',
  'waived':         'Waived',
};

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  active:    'Active',
  completed: 'Completed',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
};

export const PACKAGE_STATUS_COLORS: Record<PackageStatus, string> = {
  active:    badge.success,
  completed: badge.info,
  suspended: badge.warning,
  cancelled: badge.muted,
};

export const PRE_AUTH_STATUS_LABELS: Record<PreAuthStatus, string> = {
  'not-required': 'Not Required',
  'pending':      'Pending',
  'approved':     'Approved',
  'rejected':     'Rejected',
};

export const PRE_AUTH_STATUS_COLORS: Record<PreAuthStatus, string> = {
  'not-required': badge.muted,
  'pending':      badge.warning,
  'approved':     badge.success,
  'rejected':     badge.destructive,
};

export const REFUND_STATUS_LABELS: Record<RefundStatus, string> = {
  none:      'None',
  requested: 'Requested',
  processed: 'Processed',
};

export const BILLING_TYPE_HINTS: Record<'itemized' | 'package' | 'hybrid', string> = {
  itemized: 'Each service is charged individually as separate line items.',
  package:  'A pre-defined bundle covers multiple services at a fixed price.',
  hybrid:   'A base package applies; additional services are billed as line items.',
};

export interface BillLineItem {
  id:        string;
  name:      string;
  category:  CostCategory;
  qty:       number;
  unitPrice: number;
  total:     number;
  status:    'included' | 'extra';
}

export interface InvoicePackage {
  packageId:   string;
  packageName: string;
  packageType: string;
  amount:      number;
  startDate:   string;
  endDate:     string;
  inclusions: {
    drugs:       boolean;
    procedures:  boolean;
    consumables: boolean;
  };
  extras: number;
  status: PackageStatus;
}

export interface PayorDetails {
  insuranceTpaName?:    string;
  corporateName?:       string;
  schemeName?:          string;
  preAuthStatus?:       PreAuthStatus;
  approvedAmount?:      number;
  insuranceCorpStatus?: ClaimStatus;
}

export interface DraftPaymentRow {
  id:     string;
  mode:   PaymentMode;
  date:   string;
  amount: number;
}

// ── Oncology Packages Catalog ─────────────────────────────────────────────────

export interface OncologyPackage {
  id:         string;
  name:       string;
  type:       string;
  amount:     number;
  inclusions: { drugs: boolean; procedures: boolean; consumables: boolean; };
}

export const mockOncologyPackages: OncologyPackage[] = [
  {
    id: 'pkg-001', name: 'CCRT Package (Chemoradiation)',
    type: 'Concurrent Chemoradiation', amount: 120000,
    inclusions: { drugs: true, procedures: true, consumables: true },
  },
  {
    id: 'pkg-002', name: 'FOLFOX Cycle',
    type: 'Chemotherapy Cycle', amount: 45000,
    inclusions: { drugs: true, procedures: false, consumables: true },
  },
  {
    id: 'pkg-003', name: 'Palliative Care Bundle',
    type: 'Palliative / Supportive', amount: 25000,
    inclusions: { drugs: true, procedures: false, consumables: true },
  },
  {
    id: 'pkg-004', name: 'Post-Surgery Follow-up Package',
    type: 'Follow-up Care', amount: 15000,
    inclusions: { drugs: false, procedures: true, consumables: false },
  },
];

// ── Mock Cost Estimates ───────────────────────────────────────────────────────

export const mockCostEstimates: CostEstimate[] = [
  {
    id: 'ce1', patientId: 'p1', planId: 'tp1', createdAt: '2024-01-15', validTill: '2024-04-15',
    totalEstimate: 185000,
    notes: 'Estimate covers 3 cycles CCRT + 30 fractions IMRT. Subject to revision based on response.',
    items: [
      { id: 'ci1',  category: 'consultation', description: 'Oncologist consultation × 6',              unitCost: 1500,  quantity: 6,  total: 9000  },
      { id: 'ci2',  category: 'chemotherapy', description: 'Cisplatin 75 mg/m² (day-care × 3)',        unitCost: 8000,  quantity: 3,  total: 24000 },
      { id: 'ci3',  category: 'chemotherapy', description: 'Etoposide 100 mg/m² × 3 days × 3 cycles', unitCost: 3500,  quantity: 9,  total: 31500 },
      { id: 'ci4',  category: 'miscellaneous', description: 'IMRT planning + simulation (radiation)',   unitCost: 15000, quantity: 1,  total: 15000 },
      { id: 'ci5',  category: 'miscellaneous', description: 'IMRT fractions × 30 (radiation)',          unitCost: 2500,  quantity: 30, total: 75000 },
      { id: 'ci6',  category: 'nursing',      description: 'Day-care nursing + consumables',            unitCost: 1500,  quantity: 9,  total: 13500 },
      { id: 'ci7',  category: 'diagnostics',  description: 'CBC + LFT + RFT per cycle',                unitCost: 1500,  quantity: 3,  total: 4500  },
      { id: 'ci8',  category: 'pharmacy',     description: 'Premedications + supportive drugs',        unitCost: 2500,  quantity: 3,  total: 7500  },
      { id: 'ci9',  category: 'miscellaneous',description: 'Port access + dressing',                   unitCost: 500,   quantity: 9,  total: 4500  },
    ],
  },
  {
    id: 'ce2', patientId: 'p3', planId: 'tp2', createdAt: '2024-03-10', validTill: '2024-09-10',
    totalEstimate: 230000,
    notes: 'Includes 6 cycles FOLFOX + LAR surgery. Post-op ileostomy reversal not included.',
    items: [
      { id: 'ci10', category: 'consultation', description: 'Oncologist consultation × 8',             unitCost: 1500,  quantity: 8,  total: 12000 },
      { id: 'ci11', category: 'chemotherapy', description: 'FOLFOX — drug cost per cycle',            unitCost: 12000, quantity: 6,  total: 72000 },
      { id: 'ci12', category: 'nursing',      description: 'Day-care nursing + 46-hr infusion',       unitCost: 2500,  quantity: 6,  total: 15000 },
      { id: 'ci13', category: 'diagnostics',  description: 'CBC + LFT + RFT + CEA per cycle',        unitCost: 2000,  quantity: 6,  total: 12000 },
      { id: 'ci14', category: 'diagnostics',  description: 'MRI pelvis (mid + post treatment)',       unitCost: 8000,  quantity: 2,  total: 16000 },
      { id: 'ci15', category: 'miscellaneous', description: 'Laparoscopic LAR + anaesthesia (surgery)', unitCost: 80000, quantity: 1,  total: 80000 },
      { id: 'ci16', category: 'nursing',      description: 'Hospital stay × 7 days',                  unitCost: 2000,  quantity: 7,  total: 14000 },
      { id: 'ci17', category: 'pharmacy',     description: 'Post-op medications + antibiotics',       unitCost: 1500,  quantity: 3,  total: 4500  },
      { id: 'ci18', category: 'miscellaneous',description: 'Surgical consumables',                    unitCost: 4500,  quantity: 1,  total: 4500  },
    ],
  },
  {
    id: 'ce3', patientId: 'p8', planId: 'tp11', createdAt: '2026-01-05', validTill: '2026-07-05',
    totalEstimate: 195000,
    notes: '6 cycles Carboplatin + Paclitaxel post-surgery. BRCA testing pending.',
    items: [
      { id: 'ci19', category: 'consultation', description: 'Oncologist consultation × 8',             unitCost: 1500,  quantity: 8,  total: 12000 },
      { id: 'ci20', category: 'chemotherapy', description: 'Paclitaxel 175 mg/m² per cycle',          unitCost: 9000,  quantity: 6,  total: 54000 },
      { id: 'ci21', category: 'chemotherapy', description: 'Carboplatin AUC 5 per cycle',             unitCost: 7000,  quantity: 6,  total: 42000 },
      { id: 'ci22', category: 'nursing',      description: 'Day-care nursing + consumables',           unitCost: 2000,  quantity: 6,  total: 12000 },
      { id: 'ci23', category: 'diagnostics',  description: 'CBC + LFT + CA-125 per cycle',            unitCost: 2500,  quantity: 6,  total: 15000 },
      { id: 'ci24', category: 'diagnostics',  description: 'CT abdomen at cycle 3 + 6',               unitCost: 6000,  quantity: 2,  total: 12000 },
      { id: 'ci25', category: 'pharmacy',     description: 'Premedications + G-CSF support',          unitCost: 6000,  quantity: 6,  total: 36000 },
      { id: 'ci26', category: 'miscellaneous',description: 'Port access + PICC line dressing',        unitCost: 700,   quantity: 6,  total: 4200  },
      { id: 'ci27', category: 'diagnostics',  description: 'BRCA1/2 genetic testing',                 unitCost: 7800,  quantity: 1,  total: 7800  },
    ],
  },
];

// ── Mock Insurance Claims ─────────────────────────────────────────────────────

export const mockInsuranceClaims: InsuranceClaim[] = [
  // ── Original 6 ──────────────────────────────────────────────────────────────
  {
    id: 'ic1', patientId: 'p2', invoiceId: 'inv2',
    insurerName: 'Star Health & Allied Insurance',
    policyNumber: 'SH-2024-00182734', claimNumber: 'CLM-SH-20240310-0042',
    claimedAmount: 55000, approvedAmount: 48000,
    status: 'partially-approved', authorizationStatus: 'authorized', submittedDate: '2024-03-12', settledDate: '2024-03-28',
    tpaReceivedDate: '2024-03-28', tpaReceivedAmount: 48000, poReceivedDate: '2024-04-05', poReceivedAmount: 48000,
    remarks: 'Approved ₹48,000. Premedication costs ₹7,000 not covered under policy.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2024-03-12', note: 'Submitted to Star Health. Ref #SH-20240312-0042.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2024-03-15', note: 'All documents accepted by TPA.', status: 'done' },
      { step: 'Under Review',       completedAt: '2024-03-20', note: 'Claim under medical review.', status: 'done' },
      { step: 'Partial Approval',   completedAt: '2024-03-28', note: '₹48,000 approved. Premedication costs ₹7,000 not covered.', status: 'done' },
      { step: 'Settlement',         completedAt: '2024-03-28', note: 'Payment transferred to hospital account.', status: 'done' },
    ],
  },
  {
    id: 'ic2', patientId: 'p3', invoiceId: 'inv3',
    insurerName: 'ICICI Lombard',
    policyNumber: 'ICICI-GRP-CO-20240115', claimNumber: 'CLM-ICL-20240315-0088',
    claimedAmount: 84000, approvedAmount: 84000,
    status: 'approved', authorizationStatus: 'authorized', submittedDate: '2024-03-15', settledDate: '2024-04-01',
    tpaReceivedDate: '2024-04-01', tpaReceivedAmount: 84000, poReceivedDate: '2024-04-10', poReceivedAmount: 84000,
    remarks: 'Full corporate policy claim approved. Direct settlement to hospital.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2024-03-15', note: 'Submitted to ICICI Lombard corporate TPA.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2024-03-18', note: 'Documents verified by TPA.', status: 'done' },
      { step: 'Under Review',       completedAt: '2024-03-22', note: 'Medical review completed.', status: 'done' },
      { step: 'Approved',           completedAt: '2024-04-01', note: 'Full claim approved — ₹84,000.', status: 'done' },
      { step: 'Settlement',         completedAt: '2024-04-01', note: 'Direct settlement completed. Payment received.', status: 'done' },
    ],
  },
  {
    id: 'ic3', patientId: 'p5', invoiceId: 'inv5',
    insurerName: 'CGHS (Central Government Health Scheme)',
    policyNumber: 'CGHS-DEL-2024-78341', claimNumber: 'CLM-CGHS-20240422-0021',
    claimedAmount: 42000,
    status: 'under-review', authorizationStatus: 'pre-authorized', submittedDate: '2024-04-23',
    remarks: 'Under review with CGHS regional office. Expected 30–45 days.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2024-04-23', note: 'Submitted to CGHS regional office.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2024-04-26', note: 'Documents accepted by CGHS.', status: 'done' },
      { step: 'Under Review',       completedAt: '2024-05-01', note: 'Claim under medical review. Expected 30–45 days.', status: 'current' },
      { step: 'Awaiting Decision',  status: 'pending' },
      { step: 'Settlement',         status: 'pending' },
    ],
  },
  {
    id: 'ic4', patientId: 'p6', invoiceId: 'inv6',
    insurerName: 'New India Assurance',
    policyNumber: 'NIA-2024-14592837', claimNumber: 'CLM-NIA-20260220-0056',
    claimedAmount: 96000,
    status: 'submitted', authorizationStatus: 'pending-auth', submittedDate: '2026-02-20',
    remarks: 'Claim submitted for R-CHOP cycle 1. Documents sent.',
    timeline: [
      { step: 'Claim Submitted',   completedAt: '2026-02-20', note: 'Claim submitted for R-CHOP cycle 1.', status: 'done' },
      { step: 'Document Scrutiny', status: 'current' },
      { step: 'Under Review',      status: 'pending' },
      { step: 'Decision',          status: 'pending' },
      { step: 'Settlement',        status: 'pending' },
    ],
  },
  {
    id: 'ic5', patientId: 'p9', invoiceId: 'inv9',
    insurerName: 'Max Bupa Health Insurance',
    policyNumber: 'MBHI-2023-99203847', claimNumber: 'CLM-MB-20240915-0012',
    claimedAmount: 18000, approvedAmount: 0,
    status: 'rejected', authorizationStatus: 'pre-authorized', submittedDate: '2024-09-17', settledDate: '2024-10-05',
    remarks: 'Claim rejected — pre-existing condition clause. Patient notified.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2024-09-17', note: 'Submitted to Max Bupa.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2024-09-20', note: 'Documents accepted.', status: 'done' },
      { step: 'Under Review',       completedAt: '2024-09-25', note: 'Medical review initiated.', status: 'done' },
      { step: 'Claim Rejected',     completedAt: '2024-10-05', note: 'Pre-existing condition clause applied. Patient notified.', status: 'done' },
    ],
  },
  {
    id: 'ic6', patientId: 'p9', invoiceId: 'inv9',
    insurerName: 'Max Bupa Health Insurance',
    policyNumber: 'MBHI-2023-99203847', claimNumber: 'CLM-MB-20241010-0018',
    claimedAmount: 18000,
    status: 'appealed', authorizationStatus: 'pre-authorized', submittedDate: '2024-10-12',
    remarks: 'Appeal filed with supporting medical documents. Awaiting review.',
    timeline: [
      { step: 'Appeal Filed',           completedAt: '2024-10-12', note: 'Appeal filed with supporting medical documents.', status: 'done' },
      { step: 'Appeal Under Review',    status: 'current' },
      { step: 'Decision',               status: 'pending' },
      { step: 'Settlement / Rejection', status: 'pending' },
    ],
  },
  // ── New 7 ────────────────────────────────────────────────────────────────────
  {
    id: 'ic7', patientId: 'p3', invoiceId: 'inv11',
    insurerName: 'ICICI Lombard (Corporate)',
    policyNumber: 'ICICI-GRP-CO-20240420', claimNumber: 'CLM-ICL-20260421-0104',
    claimedAmount: 6000,
    status: 'under-review', authorizationStatus: 'pre-authorized', submittedDate: '2026-04-21',
    remarks: 'Corporate claim for chemo session. Documents submitted.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2026-04-21', note: 'Submitted to ICICI Lombard TPA.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2026-04-24', note: 'All documents accepted.', status: 'done' },
      { step: 'Under Review',       completedAt: '2026-04-28', note: 'Medical review in progress.', status: 'current' },
      { step: 'Decision',           status: 'pending' },
      { step: 'Settlement',         status: 'pending' },
    ],
  },
  {
    id: 'ic8', patientId: 'p2', invoiceId: 'inv12',
    insurerName: 'Max Bupa Health Insurance',
    policyNumber: 'MBHI-2024-00291045', claimNumber: 'CLM-MB-20260406-0031',
    claimedAmount: 2000, approvedAmount: 2000,
    status: 'approved', authorizationStatus: 'authorized', submittedDate: '2026-04-06', settledDate: '2026-04-20',
    tpaReceivedDate: '2026-04-20', tpaReceivedAmount: 2000,
    remarks: 'Full claim approved and settled.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2026-04-06', note: 'Submitted to Max Bupa.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2026-04-09', note: 'Documents accepted.', status: 'done' },
      { step: 'Under Review',       completedAt: '2026-04-12', note: 'Medical review completed.', status: 'done' },
      { step: 'Approved',           completedAt: '2026-04-20', note: 'Full claim approved — ₹2,000.', status: 'done' },
      { step: 'Settlement',         completedAt: '2026-04-20', note: 'Amount credited to hospital account.', status: 'done' },
    ],
  },
  {
    id: 'ic9', patientId: 'p5', invoiceId: 'inv14',
    insurerName: 'ESIC (Employee State Insurance Corporation)',
    policyNumber: 'ESIC-HR-2025-45921', claimNumber: 'CLM-ESIC-20260311-0007',
    claimedAmount: 1200,
    status: 'submitted', authorizationStatus: 'pending-auth', submittedDate: '2026-03-11',
    remarks: 'ESIC claim submitted for initial consultation.',
    timeline: [
      { step: 'Claim Submitted',   completedAt: '2026-03-11', note: 'Submitted to ESIC regional office, Haryana.', status: 'done' },
      { step: 'Document Scrutiny', status: 'current' },
      { step: 'Under Review',      status: 'pending' },
      { step: 'Decision',          status: 'pending' },
      { step: 'Settlement',        status: 'pending' },
    ],
  },
  {
    id: 'ic10', patientId: 'p6', invoiceId: 'inv16',
    insurerName: 'United India Insurance',
    policyNumber: 'UII-2025-33841029', claimNumber: 'CLM-UII-20260216-0019',
    claimedAmount: 1500, approvedAmount: 0,
    status: 'rejected', authorizationStatus: 'pending-auth', submittedDate: '2026-02-16', settledDate: '2026-03-10',
    remarks: 'Claim rejected — policy lapsed. Patient informed.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2026-02-16', note: 'Submitted to United India Insurance.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2026-02-19', note: 'Documents received and checked.', status: 'done' },
      { step: 'Under Review',       completedAt: '2026-02-24', note: 'Policy validity check initiated.', status: 'done' },
      { step: 'Claim Rejected',     completedAt: '2026-03-10', note: 'Policy found lapsed. Claim denied. Patient notified.', status: 'done' },
    ],
  },
  {
    id: 'ic11', patientId: 'p8', invoiceId: 'inv17',
    insurerName: 'Tata AIG General Insurance',
    policyNumber: 'TAIG-2025-GRP-88201', claimNumber: 'CLM-TAIG-20260513-0042',
    claimedAmount: 5500,
    status: 'submitted', authorizationStatus: 'pending-auth', submittedDate: '2026-05-13',
    remarks: 'Corporate group policy claim. Documents submitted.',
    timeline: [
      { step: 'Claim Submitted',   completedAt: '2026-05-13', note: 'Claim submitted under Tata AIG Group Health Policy.', status: 'done' },
      { step: 'Document Scrutiny', status: 'current' },
      { step: 'Under Review',      status: 'pending' },
      { step: 'Decision',          status: 'pending' },
      { step: 'Settlement',        status: 'pending' },
    ],
  },
  {
    id: 'ic12', patientId: 'p2', invoiceId: 'inv19',
    insurerName: 'Star Health & Allied Insurance',
    policyNumber: 'SH-2025-00392811', claimNumber: 'CLM-SH-20260526-0071',
    claimedAmount: 5500,
    status: 'submitted', authorizationStatus: 'pending-auth', submittedDate: '2026-05-26',
    remarks: 'Fresh claim for chemo cycle. Awaiting scrutiny.',
    timeline: [
      { step: 'Claim Submitted',   completedAt: '2026-05-26', note: 'Submitted to Star Health online portal.', status: 'done' },
      { step: 'Document Scrutiny', status: 'current' },
      { step: 'Under Review',      status: 'pending' },
      { step: 'Decision',          status: 'pending' },
      { step: 'Settlement',        status: 'pending' },
    ],
  },
  {
    id: 'ic13', patientId: 'p9', invoiceId: 'inv21',
    insurerName: 'HDFC ERGO Health Insurance',
    policyNumber: 'HE-2024-OPT-77341', claimNumber: 'CLM-HE-20260416-0008',
    claimedAmount: 1500, approvedAmount: 1500,
    status: 'approved', authorizationStatus: 'authorized', submittedDate: '2026-04-16', settledDate: '2026-04-28',
    tpaReceivedDate: '2026-04-28', tpaReceivedAmount: 1500, poReceivedDate: '2026-05-05', poReceivedAmount: 1500,
    remarks: 'Full claim approved and settled promptly.',
    timeline: [
      { step: 'Claim Submitted',    completedAt: '2026-04-16', note: 'Submitted via HDFC ERGO online portal.', status: 'done' },
      { step: 'Documents Verified', completedAt: '2026-04-19', note: 'All documents accepted.', status: 'done' },
      { step: 'Under Review',       completedAt: '2026-04-22', note: 'Medical review completed.', status: 'done' },
      { step: 'Approved',           completedAt: '2026-04-28', note: 'Full claim approved — ₹1,500.', status: 'done' },
      { step: 'Settlement',         completedAt: '2026-04-28', note: 'Payment credited to hospital account.', status: 'done' },
    ],
  },
];

// ── Mock Payment Records ──────────────────────────────────────────────────────

export const mockPaymentRecords: PaymentRecord[] = [
  { id: 'pr1', patientId: 'p1', invoiceId: 'inv1',  amount: 1700, mode: 'cash',  date: today, notes: 'Full payment for initial visit.', recordedBy: 'Anita Sharma' },
  { id: 'pr2', patientId: 'p3', invoiceId: 'inv3',  amount: 450,  mode: 'upi',   date: today, transactionRef: 'UPI-20240315-893421', notes: 'Follow-up — UPI via PhonePe.', recordedBy: 'Anita Sharma' },
  { id: 'pr3', patientId: 'p4', invoiceId: 'inv4',  amount: 500,  mode: 'cash',  date: today, notes: 'Partial payment. ₹400 pending.', recordedBy: 'Anita Sharma' },
  { id: 'pr4', patientId: 'p4', invoiceId: 'inv4',  amount: 400,  mode: 'upi',   date: today, transactionRef: 'UPI-20240420-112284', notes: 'Balance cleared.', recordedBy: 'Anita Sharma' },
  { id: 'pr5', patientId: 'p7', invoiceId: 'inv7',  amount: 3000, mode: 'card',  date: today, transactionRef: 'CARD-20241001-TX8821', notes: 'Advance for chemo.', recordedBy: 'Anita Sharma' },
  { id: 'pr6', patientId: 'p8', invoiceId: 'inv8',  amount: 800,  mode: 'upi',   date: today, transactionRef: 'UPI-20241122-567834', notes: 'Corporate billing — UPI.', recordedBy: 'Anita Sharma' },
  { id: 'pr7', patientId: 'p1', invoiceId: 'inv10', amount: 400,  mode: 'cash',  date: '2026-05-01', notes: 'Partial payment for regular visit.', recordedBy: 'Anita Sharma' },
  { id: 'pr8', patientId: 'p2', invoiceId: 'inv12', amount: 2000, mode: 'insurance-transfer', date: '2026-04-20', transactionRef: 'INS-MB-20260420-031', notes: 'Insurance settlement received.', recordedBy: 'Anita Sharma' },
  { id: 'pr9', patientId: 'p4', invoiceId: 'inv13', amount: 800,  mode: 'upi',   date: '2026-05-15', transactionRef: 'UPI-20260515-449921', notes: 'Full payment.', recordedBy: 'Anita Sharma' },
  { id: 'pr10',patientId: 'p7', invoiceId: 'inv15', amount: 2000, mode: 'cash',  date: '2026-04-25', notes: 'Partial advance for chemo cycle.', recordedBy: 'Anita Sharma' },
  { id: 'pr11',patientId: 'p1', invoiceId: 'inv18', amount: 500,  mode: 'upi',   date: today, transactionRef: 'UPI-20260528-887734', notes: 'Follow-up — UPI.', recordedBy: 'Anita Sharma' },
  { id: 'pr12',patientId: 'p9', invoiceId: 'inv21', amount: 1500, mode: 'insurance-transfer', date: '2026-04-28', transactionRef: 'INS-HE-20260428-008', notes: 'HDFC ERGO settlement.', recordedBy: 'Anita Sharma' },
];

// ── Mock Invoices ─────────────────────────────────────────────────────────────

export const mockInvoices: Invoice[] = [
  // ── Original 9 ──────────────────────────────────────────────────────────────
  { id: 'inv1',  invoiceNumber: invN('Kurukshetra', 1),  appointmentId: 'a1',  visitId: vId('Kurukshetra', 1),  patientId: 'p1', visitType: 'initial-visit',  visitCharges: 1500, additionalCharges: 200, discount:   0, paymentType: 'self-pay',   paymentStatus: 'paid',     createdAt: today,        center: 'Kurukshetra', billingType: 'itemized',                paidAmount: 1700 },
  { id: 'inv2',  invoiceNumber: invN('Panipat',    1),  appointmentId: 'a2',  visitId: vId('Panipat',    1),  patientId: 'p2', visitType: 'chemo-session',  visitCharges: 5000, additionalCharges: 500, discount:   0, paymentType: 'insurance',  paymentStatus: 'pre-auth', createdAt: '2026-05-20', center: 'Panipat',     billingType: 'package',  claimId: 'ic1', paidAmount: 0 },
  { id: 'inv3',  invoiceNumber: invN('Kurukshetra', 2),  appointmentId: 'a3',  visitId: vId('Kurukshetra', 2),  patientId: 'p3', visitType: 'follow-up',      visitCharges:  500, additionalCharges:   0, discount:  50, paymentType: 'corporate',  paymentStatus: 'pre-auth', createdAt: '2026-05-22', center: 'Kurukshetra', billingType: 'itemized', claimId: 'ic2', paidAmount: 0 },
  { id: 'inv4',  invoiceNumber: invN('Shimla',     1),  appointmentId: 'a4',  visitId: vId('Shimla',     1),  patientId: 'p4', visitType: 'regular-visit',  visitCharges:  800, additionalCharges: 100, discount:   0, paymentType: 'self-pay',   paymentStatus: 'pending',  createdAt: '2026-04-15', center: 'Shimla',      billingType: 'itemized',                paidAmount: 400 },
  { id: 'inv5',  invoiceNumber: invN('Panipat',    2),  appointmentId: 'a5',  visitId: vId('Panipat',    2),  patientId: 'p5', visitType: 'initial-visit',  visitCharges: 1500, additionalCharges:   0, discount: 300, paymentType: 'government', paymentStatus: 'pre-auth', createdAt: '2026-04-10', center: 'Panipat',     billingType: 'itemized', claimId: 'ic3', paidAmount: 0 },
  { id: 'inv6',  invoiceNumber: invN('Una',        1),  appointmentId: 'a6',  visitId: vId('Una',        1),  patientId: 'p6', visitType: 'follow-up-free', visitCharges:    0, additionalCharges:   0, discount:   0, paymentType: 'insurance',  paymentStatus: 'waived',   createdAt: '2026-05-05', center: 'Una',         billingType: 'itemized', claimId: 'ic4', paidAmount: 0 },
  { id: 'inv7',  invoiceNumber: invN('Kurukshetra', 3),  appointmentId: 'a7',  visitId: vId('Kurukshetra', 3),  patientId: 'p7', visitType: 'chemo-session',  visitCharges: 5000, additionalCharges: 800, discount:   0, paymentType: 'self-pay',   paymentStatus: 'pending',  createdAt: today,        center: 'Kurukshetra', billingType: 'package',                 paidAmount: 3000 },
  { id: 'inv8',  invoiceNumber: invN('Deoria',     1),  appointmentId: 'a8',  visitId: vId('Deoria',     1),  patientId: 'p8', visitType: 'regular-visit',  visitCharges:  800, additionalCharges:   0, discount:   0, paymentType: 'corporate',  paymentStatus: 'pre-auth', createdAt: '2026-05-10', center: 'Deoria',      billingType: 'itemized', claimId: 'ic5', paidAmount: 0 },
  { id: 'inv9',  invoiceNumber: invN('Una',        2),  appointmentId: 'a9',  visitId: vId('Una',        2),  patientId: 'p9', visitType: 'follow-up',      visitCharges:  500, additionalCharges:   0, discount:   0, paymentType: 'insurance',  paymentStatus: 'pre-auth', createdAt: '2026-03-20', center: 'Una',         billingType: 'itemized', claimId: 'ic6', paidAmount: 0 },
  // ── New 12 ───────────────────────────────────────────────────────────────────
  { id: 'inv10', invoiceNumber: invN('Kurukshetra', 4),  appointmentId: 'a10', visitId: vId('Kurukshetra', 4),  patientId: 'p1', visitType: 'regular-visit',  visitCharges:  800, additionalCharges:   0, discount:   0, paymentType: 'self-pay',   paymentStatus: 'pending',  createdAt: '2026-05-01', center: 'Kurukshetra', billingType: 'itemized',                paidAmount: 400 },
  { id: 'inv11', invoiceNumber: invN('Kurukshetra', 5),  appointmentId: 'a11', visitId: vId('Kurukshetra', 5),  patientId: 'p3', visitType: 'chemo-session',  visitCharges: 5000, additionalCharges: 1000, discount:  0, paymentType: 'corporate',  paymentStatus: 'pre-auth', createdAt: '2026-04-20', center: 'Kurukshetra', billingType: 'package',  claimId: 'ic7', paidAmount: 0 },
  { id: 'inv12', invoiceNumber: invN('Panipat',    3),  appointmentId: 'a12', visitId: vId('Panipat',    3),  patientId: 'p2', visitType: 'initial-visit',  visitCharges: 1500, additionalCharges: 500, discount:   0, paymentType: 'insurance',  paymentStatus: 'paid',     createdAt: '2026-04-05', center: 'Panipat',     billingType: 'itemized', claimId: 'ic8', paidAmount: 2000 },
  { id: 'inv13', invoiceNumber: invN('Shimla',     2),  appointmentId: 'a13', visitId: vId('Shimla',     2),  patientId: 'p4', visitType: 'regular-visit',  visitCharges:  800, additionalCharges:   0, discount:   0, paymentType: 'self-pay',   paymentStatus: 'paid',     createdAt: '2026-05-15', center: 'Shimla',      billingType: 'itemized',                paidAmount: 800 },
  { id: 'inv14', invoiceNumber: invN('Panipat',    4),  appointmentId: 'a14', visitId: vId('Panipat',    4),  patientId: 'p5', visitType: 'initial-visit',  visitCharges: 1500, additionalCharges:   0, discount: 300, paymentType: 'government', paymentStatus: 'pre-auth', createdAt: '2026-03-10', center: 'Panipat',     billingType: 'itemized', claimId: 'ic9', paidAmount: 0 },
  { id: 'inv15', invoiceNumber: invN('Kurukshetra', 6),  appointmentId: 'a15', visitId: vId('Kurukshetra', 6),  patientId: 'p7', visitType: 'chemo-session',  visitCharges: 5000, additionalCharges: 800, discount:   0, paymentType: 'self-pay',   paymentStatus: 'pending',  createdAt: '2026-04-25', center: 'Kurukshetra', billingType: 'package',                 paidAmount: 2000 },
  { id: 'inv16', invoiceNumber: invN('Una',        3),  appointmentId: 'a16', visitId: vId('Una',        3),  patientId: 'p6', visitType: 'initial-visit',  visitCharges: 1500, additionalCharges:   0, discount:   0, paymentType: 'insurance',  paymentStatus: 'pending',  createdAt: '2026-02-15', center: 'Una',         billingType: 'itemized', claimId: 'ic10',paidAmount: 0 },
  { id: 'inv17', invoiceNumber: invN('Deoria',     2),  appointmentId: 'a17', visitId: vId('Deoria',     2),  patientId: 'p8', visitType: 'chemo-session',  visitCharges: 5000, additionalCharges: 500, discount:   0, paymentType: 'corporate',  paymentStatus: 'pre-auth', createdAt: '2026-05-12', center: 'Deoria',      billingType: 'hybrid',   claimId: 'ic11',paidAmount: 0 },
  { id: 'inv18', invoiceNumber: invN('Kurukshetra', 7),  appointmentId: 'a18', visitId: vId('Kurukshetra', 7),  patientId: 'p1', visitType: 'follow-up',      visitCharges:  500, additionalCharges:   0, discount:   0, paymentType: 'self-pay',   paymentStatus: 'paid',     createdAt: today,        center: 'Kurukshetra', billingType: 'itemized',                paidAmount: 500 },
  { id: 'inv19', invoiceNumber: invN('Panipat',    5),  appointmentId: 'a19', visitId: vId('Panipat',    5),  patientId: 'p2', visitType: 'chemo-session',  visitCharges: 5000, additionalCharges: 500, discount:   0, paymentType: 'insurance',  paymentStatus: 'pre-auth', createdAt: '2026-05-25', center: 'Panipat',     billingType: 'package',  claimId: 'ic12',paidAmount: 0 },
  { id: 'inv20', invoiceNumber: invN('Shimla',     3),  appointmentId: 'a20', visitId: vId('Shimla',     3),  patientId: 'p4', visitType: 'regular-visit',  visitCharges:  800, additionalCharges: 200, discount:   0, paymentType: 'self-pay',   paymentStatus: 'pending',  createdAt: '2026-03-01', center: 'Shimla',      billingType: 'itemized',                paidAmount: 0 },
  { id: 'inv21', invoiceNumber: invN('Una',        4),  appointmentId: 'a21', visitId: vId('Una',        4),  patientId: 'p9', visitType: 'initial-visit',  visitCharges: 1500, additionalCharges:   0, discount:   0, paymentType: 'insurance',  paymentStatus: 'paid',     createdAt: '2026-04-15', center: 'Una',         billingType: 'itemized', claimId: 'ic13',paidAmount: 1500 },
];

// ── Chemo Drug Cost Tracking (Admin only) ─────────────────────────────────────

export interface ChemoDrugCost {
  id:           string;
  patientId:    string;
  center:       string;
  date:         string;
  drug:         string;
  quantity:     number;
  unit:         string;
  purchaseCost: number;   // clinic's procurement cost
  billedAmount: number;   // amount billed to patient / insurer
}

export const mockChemoDrugCosts: ChemoDrugCost[] = [
  // Kurukshetra
  { id: 'cdc1',  patientId: 'p1', center: 'Kurukshetra', date: today,         drug: 'Cisplatin 50 mg',    quantity: 1, unit: 'vial',   purchaseCost: 1800, billedAmount: 3000 },
  { id: 'cdc2',  patientId: 'p3', center: 'Kurukshetra', date: '2026-04-20',  drug: 'Oxaliplatin 100 mg', quantity: 2, unit: 'vials',  purchaseCost: 4200, billedAmount: 7000 },
  { id: 'cdc3',  patientId: 'p7', center: 'Kurukshetra', date: '2026-04-25',  drug: 'Docetaxel 80 mg',    quantity: 1, unit: 'vial',   purchaseCost: 5500, billedAmount: 8500 },
  { id: 'cdc4',  patientId: 'p1', center: 'Kurukshetra', date: '2026-05-01',  drug: 'Paclitaxel 150 mg',  quantity: 1, unit: 'vial',   purchaseCost: 3200, billedAmount: 5000 },
  // Panipat
  { id: 'cdc5',  patientId: 'p2', center: 'Panipat',     date: '2026-04-06',  drug: 'Carboplatin AUC 5',  quantity: 1, unit: 'vial',   purchaseCost: 2800, billedAmount: 4500 },
  { id: 'cdc6',  patientId: 'p5', center: 'Panipat',     date: '2026-03-10',  drug: 'Etoposide 100 mg',   quantity: 3, unit: 'vials',  purchaseCost: 2100, billedAmount: 3600 },
  { id: 'cdc7',  patientId: 'p2', center: 'Panipat',     date: '2026-05-25',  drug: 'Trastuzumab 440 mg', quantity: 1, unit: 'vial',   purchaseCost:28000, billedAmount:38000 },
  // Shimla
  { id: 'cdc8',  patientId: 'p4', center: 'Shimla',      date: '2026-04-15',  drug: 'Gemcitabine 1000 mg',quantity: 2, unit: 'vials',  purchaseCost: 3800, billedAmount: 6000 },
  // Deoria
  { id: 'cdc9',  patientId: 'p8', center: 'Deoria',      date: '2026-05-12',  drug: 'Cisplatin 75 mg',    quantity: 1, unit: 'vial',   purchaseCost: 2400, billedAmount: 4000 },
  { id: 'cdc10', patientId: 'p8', center: 'Deoria',      date: '2026-05-12',  drug: 'Etoposide 150 mg',   quantity: 2, unit: 'vials',  purchaseCost: 3600, billedAmount: 5500 },
  // Una
  { id: 'cdc11', patientId: 'p9', center: 'Una',         date: '2026-04-15',  drug: 'Rituximab 500 mg',   quantity: 1, unit: 'vial',   purchaseCost:18000, billedAmount:26000 },
  { id: 'cdc12', patientId: 'p6', center: 'Una',         date: '2026-05-05',  drug: 'Cyclophosphamide 1g',quantity: 1, unit: 'vial',   purchaseCost: 1200, billedAmount: 2200 },
];

// ── Mock Expenses ─────────────────────────────────────────────────────────────

export const mockExpenses: Expense[] = [
  // Kurukshetra (7)
  { id: 'EX-KRK-00000001', center: 'Kurukshetra', date: today,         category: 'consumables',  description: 'IV lines, syringes, gloves — monthly stock',          amount: 12500, paidBy: 'Anita Sharma'   },
  { id: 'EX-KRK-00000002', center: 'Kurukshetra', date: today,         category: 'utilities',    description: 'Electricity bill — May 2026',                         amount: 18000, paidBy: 'Vikram Singh'   },
  { id: 'EX-KRK-00000003', center: 'Kurukshetra', date: '2026-05-20',  category: 'maintenance',  description: 'Linear accelerator quarterly servicing',              amount: 45000, paidBy: 'Dr. Suresh Nair' },
  { id: 'EX-KRK-00000004', center: 'Kurukshetra', date: '2026-05-15',  category: 'staff-salary', description: 'Nursing staff salary — May 2026',                     amount: 85000, paidBy: 'Vikram Singh'   },
  { id: 'EX-KRK-00000005', center: 'Kurukshetra', date: '2026-05-22',  category: 'drugs',        description: 'Ondansetron, Dexamethasone, Granisetron — monthly',   amount: 32000, paidBy: 'Dr. Rahul Mehta' },
  { id: 'EX-KRK-00000006', center: 'Kurukshetra', date: '2026-05-18',  category: 'lab-supplies', description: 'CBC kits, LFT reagents, urine strips — restock',       amount: 8500,  paidBy: 'Priya Nair'     },
  { id: 'EX-KRK-00000007', center: 'Kurukshetra', date: '2026-05-05',  category: 'marketing',    description: 'Patient awareness camp — signage & materials',          amount: 12000, paidBy: 'Vikram Singh'   },
  // Panipat (5)
  { id: 'EX-PNP-00000001', center: 'Panipat',     date: today,         category: 'consumables',  description: 'Chemotherapy consumables — May restock',              amount: 9800,  paidBy: 'Anita Sharma'   },
  { id: 'EX-PNP-00000002', center: 'Panipat',     date: '2026-05-22',  category: 'utilities',    description: 'Electricity + water bill — May 2026',                 amount: 14500, paidBy: 'Vikram Singh'   },
  { id: 'EX-PNP-00000003', center: 'Panipat',     date: '2026-05-18',  category: 'drugs',        description: 'Cisplatin, Paclitaxel, Carboplatin — monthly supply',  amount: 28000, paidBy: 'Dr. Ananya Singh'},
  { id: 'EX-PNP-00000004', center: 'Panipat',     date: '2026-05-15',  category: 'staff-salary', description: 'All staff salary — May 2026',                         amount: 72000, paidBy: 'Vikram Singh'   },
  { id: 'EX-PNP-00000005', center: 'Panipat',     date: '2026-04-28',  category: 'maintenance',  description: 'Infusion pump calibration + service',                 amount: 18500, paidBy: 'Dr. Suresh Nair' },
  // Shimla (5)
  { id: 'EX-SML-00000001', center: 'Shimla',      date: '2026-04-30',  category: 'rent',         description: 'Monthly facility rent — May 2026',                    amount: 55000, paidBy: 'Vikram Singh'   },
  { id: 'EX-SML-00000002', center: 'Shimla',      date: '2026-05-10',  category: 'equipment',    description: 'Infusion pump replacement × 2',                       amount: 28000, paidBy: 'Dr. Suresh Nair' },
  { id: 'EX-SML-00000003', center: 'Shimla',      date: '2026-05-12',  category: 'drugs',        description: 'Antiemetics + analgesics monthly stock',              amount: 24500, paidBy: 'Dr. Ananya Singh'},
  { id: 'EX-SML-00000004', center: 'Shimla',      date: '2026-05-15',  category: 'staff-salary', description: 'All staff salary — May 2026',                         amount: 68000, paidBy: 'Vikram Singh'   },
  { id: 'EX-SML-00000005', center: 'Shimla',      date: '2026-05-08',  category: 'lab-supplies', description: 'Blood glucose strips, CBC reagents — May restock',    amount: 9800,  paidBy: 'Kavya Reddy'    },
  // Una (4)
  { id: 'EX-UNA-00000001', center: 'Una',         date: '2026-05-05',  category: 'staff-salary', description: 'All staff salary — May 2026',                         amount: 62000, paidBy: 'Vikram Singh'   },
  { id: 'EX-UNA-00000002', center: 'Una',         date: '2026-05-14',  category: 'drugs',        description: 'Tramadol, Paracetamol, Ranitidine — monthly supply',   amount: 18000, paidBy: 'Dr. Rahul Mehta' },
  { id: 'EX-UNA-00000003', center: 'Una',         date: '2026-05-10',  category: 'consumables',  description: 'Syringes, IV bags, tape — May restock',               amount: 7200,  paidBy: 'Sunita Patel'   },
  { id: 'EX-UNA-00000004', center: 'Una',         date: '2026-04-25',  category: 'equipment',    description: 'Portable vital signs monitor — replacement',           amount: 35000, paidBy: 'Dr. Suresh Nair' },
  // Deoria (4)
  { id: 'EX-DRA-00000001', center: 'Deoria',      date: '2026-05-10',  category: 'miscellaneous',description: 'Signage + patient info boards — new installation',      amount: 7500,  paidBy: 'Vikram Singh'   },
  { id: 'EX-DRA-00000002', center: 'Deoria',      date: '2026-05-16',  category: 'drugs',        description: 'Metoclopramide, Ondansetron, Tramadol — monthly',      amount: 15500, paidBy: 'Dr. Ananya Singh'},
  { id: 'EX-DRA-00000003', center: 'Deoria',      date: '2026-05-15',  category: 'staff-salary', description: 'All staff salary — May 2026',                         amount: 45000, paidBy: 'Vikram Singh'   },
  { id: 'EX-DRA-00000004', center: 'Deoria',      date: '2026-05-22',  category: 'utilities',    description: 'Electricity + internet — May 2026',                   amount: 11000, paidBy: 'Vikram Singh'   },
];
