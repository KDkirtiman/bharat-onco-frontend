import * as styles from './GenerateFullInvoiceOverlay.styles';
import { useState, useMemo } from 'react';
import {
  X, Receipt, Plus, Trash2, ArrowUpRight, Save, CheckCircle2,
  AlertTriangle, User,
} from 'bfd-icons';

import { Modal } from 'bfd-core';
import { IconButton } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { AppointmentType, SelfPayMethod } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, SELF_PAY_METHOD_LABELS } from 'bfd-core';
import type { Role } from 'bfd-core';
import type {
  Invoice, BillLineItem, DraftPaymentRow, CareSetting, Department,
  InvoiceStatus, InvoicePmtStatus, PackageStatus, PreAuthStatus,
  RefundStatus, ClaimStatus, PaymentMode, CostCategory, CostEstimate,
} from 'bfd-core';
import {
  generateInvoiceNumber,
  CARE_SETTING_LABELS, DEPARTMENT_LABELS,
  INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS,
  INVOICE_PMT_STATUS_LABELS,
  PACKAGE_STATUS_LABELS,
  PRE_AUTH_STATUS_LABELS,
  REFUND_STATUS_LABELS,
  BILLING_TYPE_HINTS,
  COST_CATEGORY_LABELS,
  PAYMENT_MODE_LABELS,
  CLAIM_STATUS_LABELS,
  mockOncologyPackages,
  formatCurrency,
} from 'bfd-core';

// ── Draft form shape ──────────────────────────────────────────────────────────

interface DraftForm {
  invoiceNumber:       string;
  invoiceDate:         string;
  patientId:           string;
  careSetting:         CareSetting;
  visitType:           AppointmentType;
  department:          Department;
  billingType:         'itemized' | 'package' | 'hybrid';
  packageId:           string;
  packageName:         string;
  packageType:         string;
  packageAmount:       string;
  packageStart:        string;
  packageEnd:          string;
  inclDrugs:           boolean;
  inclProcedures:      boolean;
  inclConsumables:     boolean;
  packageExtras:       string;
  packageStatus:       PackageStatus;
  lineItems:           BillLineItem[];
  discount:            string;
  payments:            DraftPaymentRow[];
  payorType:           'self-pay' | 'insurance' | 'corporate' | 'government';
  selfPayMethod:       SelfPayMethod;
  transactionId:       string;
  insuranceTpaName:    string;
  corporateName:       string;
  schemeName:          string;
  preAuthStatus:       PreAuthStatus;
  approvedAmount:      string;
  insuranceCorpStatus: ClaimStatus | '';
  invoiceStatus:       InvoiceStatus;
  invoicePmtStatus:    InvoicePmtStatus;
  refundStatus:        RefundStatus;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface InvoicePrefill {
  patientId?:        string;
  patientName?:      string;
  lineItems?:        BillLineItem[];
  payorType?:        DraftForm['payorType'];
  insuranceTpaName?: string;
  corporateName?:    string;
  schemeName?:       string;
}

interface Props {
  selectedCenter:     string;
  patients:           Patient[];
  userRole:           Role;
  existingDraft?:     Invoice;
  centerInvoiceCount: number;
  prefill?:           InvoicePrefill;
  costEstimates?:     CostEstimate[];
  onSave:             (invoice: Invoice) => void;
  onClose:            () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0];

function computeGross(f: DraftForm): number {
  const lineTotal = f.lineItems.reduce((s, i) => s + i.total, 0);
  const pkgAmt    = parseFloat(f.packageAmount) || 0;
  const extras    = parseFloat(f.packageExtras)  || 0;
  if (f.billingType === 'itemized') return lineTotal;
  if (f.billingType === 'package')  return pkgAmt + extras;
  return pkgAmt + lineTotal + extras;
}

function makeDefault(center: string, seq: number): DraftForm {
  return {
    invoiceNumber: generateInvoiceNumber(center, TODAY, seq + 1),
    invoiceDate: TODAY, patientId: '',
    careSetting: 'opd', visitType: 'initial-visit', department: 'chemo',
    billingType: 'itemized',
    packageId: '', packageName: '', packageType: '',
    packageAmount: '', packageStart: TODAY, packageEnd: TODAY,
    inclDrugs: false, inclProcedures: false, inclConsumables: false,
    packageExtras: '', packageStatus: 'active',
    lineItems: [], discount: '', payments: [],
    payorType: 'self-pay',
    selfPayMethod: 'cash', transactionId: '',
    insuranceTpaName: '', corporateName: '', schemeName: '',
    preAuthStatus: 'not-required', approvedAmount: '', insuranceCorpStatus: '',
    invoiceStatus: 'draft', invoicePmtStatus: 'unpaid', refundStatus: 'none',
  };
}

function fromExisting(inv: Invoice): DraftForm {
  return {
    invoiceNumber:    inv.invoiceNumber,
    invoiceDate:      inv.createdAt,
    patientId:        inv.patientId,
    careSetting:      inv.careSetting   ?? 'opd',
    visitType:        inv.visitType,
    department:       inv.department    ?? 'chemo',
    billingType:      inv.billingType,
    packageId:        inv.invoicePackage?.packageId   ?? '',
    packageName:      inv.invoicePackage?.packageName ?? '',
    packageType:      inv.invoicePackage?.packageType ?? '',
    packageAmount:    String(inv.invoicePackage?.amount ?? ''),
    packageStart:     inv.invoicePackage?.startDate ?? TODAY,
    packageEnd:       inv.invoicePackage?.endDate   ?? TODAY,
    inclDrugs:        inv.invoicePackage?.inclusions.drugs       ?? false,
    inclProcedures:   inv.invoicePackage?.inclusions.procedures  ?? false,
    inclConsumables:  inv.invoicePackage?.inclusions.consumables ?? false,
    packageExtras:    String(inv.invoicePackage?.extras ?? ''),
    packageStatus:    inv.invoicePackage?.status ?? 'active',
    lineItems:        inv.lineItems   ?? [],
    discount:         String(inv.discount || ''),
    payments:         inv.draftPayments ?? [],
    payorType:        inv.paymentType as DraftForm['payorType'],
    selfPayMethod:    inv.paymentMethod ?? 'cash',
    transactionId:    inv.transactionId ?? '',
    insuranceTpaName: inv.payorDetails?.insuranceTpaName ?? '',
    corporateName:    inv.payorDetails?.corporateName   ?? '',
    schemeName:       inv.payorDetails?.schemeName      ?? '',
    preAuthStatus:    inv.payorDetails?.preAuthStatus   ?? 'not-required',
    approvedAmount:   String(inv.payorDetails?.approvedAmount ?? ''),
    insuranceCorpStatus: inv.payorDetails?.insuranceCorpStatus ?? '',
    invoiceStatus:    inv.invoiceStatus    ?? 'draft',
    invoicePmtStatus: inv.invoicePmtStatus ?? 'unpaid',
    refundStatus:     inv.refundStatus     ?? 'none',
  };
}

function toInvoice(f: DraftForm, id: string, center: string): Invoice {
  const gross   = computeGross(f);
  const disc    = parseFloat(f.discount) || 0;
  const paidAmt = f.payments.reduce((s, p) => s + p.amount, 0);
  return {
    id,
    invoiceNumber: f.invoiceNumber, appointmentId: '', visitId: '',
    patientId: f.patientId, visitType: f.visitType,
    visitCharges: gross, additionalCharges: 0, discount: disc,
    paymentType: f.payorType, paymentStatus: 'pending',
    paymentMethod: f.payorType === 'self-pay' ? f.selfPayMethod : undefined,
    transactionId: f.payorType === 'self-pay' && f.transactionId ? f.transactionId : undefined,
    createdAt: f.invoiceDate, center, billingType: f.billingType,
    paidAmount: paidAmt,
    careSetting: f.careSetting, department: f.department,
    invoiceStatus: f.invoiceStatus, invoicePmtStatus: f.invoicePmtStatus,
    refundStatus: f.refundStatus, lineItems: f.lineItems,
    invoicePackage: f.billingType !== 'itemized' ? {
      packageId: f.packageId, packageName: f.packageName,
      packageType: f.packageType, amount: parseFloat(f.packageAmount) || 0,
      startDate: f.packageStart, endDate: f.packageEnd,
      inclusions: { drugs: f.inclDrugs, procedures: f.inclProcedures, consumables: f.inclConsumables },
      extras: parseFloat(f.packageExtras) || 0, status: f.packageStatus,
    } : undefined,
    draftPayments: f.payments,
    payorDetails: f.payorType !== 'self-pay' ? {
      insuranceTpaName:    f.insuranceTpaName  || undefined,
      corporateName:       f.corporateName     || undefined,
      schemeName:          f.schemeName        || undefined,
      preAuthStatus:       f.preAuthStatus,
      approvedAmount:      parseFloat(f.approvedAmount) || undefined,
      insuranceCorpStatus: (f.insuranceCorpStatus || undefined) as ClaimStatus | undefined,
    } : undefined,
  };
}

// ── Main component ────────────────────────────────────────────────────────────

export function GenerateFullInvoiceOverlay({
  selectedCenter, patients, userRole, existingDraft, centerInvoiceCount,
  prefill, costEstimates, onSave, onClose,
}: Props) {
  const isReadOnly = !!existingDraft && userRole !== 'staff';

  const [draft, setDraft] = useState<DraftForm>(() => {
    if (existingDraft) return fromExisting(existingDraft);
    const base = makeDefault(selectedCenter, centerInvoiceCount);
    if (!prefill) return base;
    return {
      ...base,
      patientId:        prefill.patientId        ?? base.patientId,
      lineItems:        prefill.lineItems?.length ? prefill.lineItems : base.lineItems,
      payorType:        prefill.payorType         ?? base.payorType,
      insuranceTpaName: prefill.insuranceTpaName  ?? base.insuranceTpaName,
      corporateName:    prefill.corporateName     ?? base.corporateName,
      schemeName:       prefill.schemeName        ?? base.schemeName,
    };
  });
  const [errors, setErrors]               = useState<Record<string, string>>({});
  const [patientSearch, setPatientSearch] = useState(() => {
    if (existingDraft)      return patients.find(p => p.id === existingDraft.patientId)?.name ?? '';
    if (prefill?.patientId) return patients.find(p => p.id === prefill.patientId)?.name ?? (prefill.patientName ?? '');
    return '';
  });
  const [showPatientDrop, setShowPatientDrop] = useState(false);

  const selectedPatient = patients.find(p => p.id === draft.patientId);
  const showPackage     = draft.billingType !== 'itemized';
  const showPayorExtra  = draft.payorType !== 'self-pay';

  const gross      = useMemo(() => computeGross(draft), [draft]);
  const discount   = parseFloat(draft.discount) || 0;
  const netPayable = Math.max(0, gross - discount);
  const paidAmt    = useMemo(() => draft.payments.reduce((s, p) => s + p.amount, 0), [draft.payments]);
  const balance    = Math.max(0, netPayable - paidAmt);

  const alerts = useMemo(() => {
    const list: { title: string; desc: string }[] = [];
    if (gross > 0 && discount / gross > 0.3)
      list.push({ title: 'High Discount', desc: `Discount is ${Math.round(discount / gross * 100)}% of gross amount` });
    if (balance > 50000)
      list.push({ title: 'Large Outstanding', desc: `Balance ₹${balance.toLocaleString('en-IN')} exceeds ₹50,000` });
    const extraCount = draft.lineItems.filter(i => i.status === 'extra').length;
    if (extraCount > 0)
      list.push({ title: 'Extra Items Beyond Package', desc: `${extraCount} item${extraCount > 1 ? 's' : ''} marked as extra` });
    if (showPayorExtra && draft.preAuthStatus === 'pending')
      list.push({ title: 'Pending Approval', desc: 'Pre-authorisation has not been approved yet' });
    return list;
  }, [gross, discount, balance, draft.lineItems, showPayorExtra, draft.preAuthStatus]);

  // ── State helpers ─────────────────────────────────────────────────────────────

  function upd<K extends keyof DraftForm>(key: K, val: DraftForm[K]) {
    setDraft(d => ({ ...d, [key]: val }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function addLineItem() {
    const item: BillLineItem = {
      id: `li-${Date.now()}`, name: '', category: 'consultation',
      qty: 1, unitPrice: 0, total: 0, status: 'included',
    };
    setDraft(d => ({ ...d, lineItems: [...d.lineItems, item] }));
  }
  function updLine(id: string, patch: Partial<BillLineItem>) {
    setDraft(d => ({
      ...d,
      lineItems: d.lineItems.map(i => {
        if (i.id !== id) return i;
        const u = { ...i, ...patch };
        if ('qty' in patch || 'unitPrice' in patch) u.total = u.qty * u.unitPrice;
        return u;
      }),
    }));
  }
  function removeLine(id: string) {
    setDraft(d => ({ ...d, lineItems: d.lineItems.filter(i => i.id !== id) }));
  }

  function addPayment() {
    const row: DraftPaymentRow = { id: `pr-${Date.now()}`, mode: 'cash', date: TODAY, amount: 0 };
    setDraft(d => ({ ...d, payments: [...d.payments, row] }));
  }
  function updPayment(id: string, patch: Partial<DraftPaymentRow>) {
    setDraft(d => ({ ...d, payments: d.payments.map(r => r.id === id ? { ...r, ...patch } : r) }));
  }
  function removePayment(id: string) {
    setDraft(d => ({ ...d, payments: d.payments.filter(r => r.id !== id) }));
  }

  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return [];
    const q = patientSearch.toLowerCase();
    return patients.filter(p =>
      p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [patientSearch, patients]);

  function selectPatient(p: Patient) {
    const payorMap: Record<string, DraftForm['payorType']> = {
      self: 'self-pay', insurance: 'insurance', corporate: 'corporate', government: 'government',
    };
    const payorType: DraftForm['payorType'] = payorMap[p.payor?.type ?? 'self'] ?? 'self-pay';

    const estimate = costEstimates?.find(e => e.patientId === p.id);
    const autoItems: BillLineItem[] = estimate?.items.map(item => ({
      id: `li-${item.id}`, name: item.description, category: item.category,
      qty: item.quantity, unitPrice: item.unitCost, total: item.total, status: 'included' as const,
    })) ?? [];

    setDraft(d => ({
      ...d,
      patientId:        p.id,
      payorType,
      insuranceTpaName: payorType === 'insurance' ? (p.payor?.insurance?.name       ?? d.insuranceTpaName) : d.insuranceTpaName,
      corporateName:    payorType === 'corporate'  ? (p.payor?.corporate?.corporateName ?? d.corporateName)    : d.corporateName,
      schemeName:       payorType === 'government' ? (p.payor?.government?.schemeName   ?? d.schemeName)       : d.schemeName,
      ...(autoItems.length > 0 ? { lineItems: autoItems } : {}),
    }));
    setErrors(e => { const n = { ...e }; delete n.patientId; return n; });
    setPatientSearch(p.name);
    setShowPatientDrop(false);
  }

  function onPackageSelect(pkgId: string) {
    const pkg = mockOncologyPackages.find(p => p.id === pkgId);
    if (!pkg) { upd('packageId', ''); return; }
    setDraft(d => ({
      ...d,
      packageId: pkg.id, packageName: pkg.name, packageType: pkg.type,
      packageAmount: String(pkg.amount),
      inclDrugs: pkg.inclusions.drugs,
      inclProcedures: pkg.inclusions.procedures,
      inclConsumables: pkg.inclusions.consumables,
    }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!draft.patientId)   e.patientId   = 'Patient is required';
    if (!draft.invoiceDate) e.invoiceDate  = 'Invoice date is required';
    if (showPackage) {
      if (!draft.packageName)                                         e.packageName   = 'Package name is required';
      if (!draft.packageAmount || parseFloat(draft.packageAmount) <= 0) e.packageAmount = 'Package amount is required';
      if (!draft.packageStart) e.packageStart = 'Start date is required';
      if (!draft.packageEnd)   e.packageEnd   = 'End date is required';
    }
    if (draft.billingType !== 'package' && draft.lineItems.length === 0)
      e.lineItems = 'At least one line item is required';
    draft.lineItems.forEach((item, i) => {
      if (!item.name)          e[`li_name_${i}`]  = 'Name required';
      if (item.unitPrice <= 0) e[`li_price_${i}`] = 'Price required';
    });
    if (showPayorExtra) {
      if (draft.payorType === 'insurance' && !draft.insuranceTpaName) e.insuranceTpaName = 'TPA name required';
      if (draft.payorType === 'corporate'  && !draft.corporateName)   e.corporateName    = 'Corporate name required';
      if (draft.payorType === 'government' && !draft.schemeName)      e.schemeName       = 'Scheme name required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave(status: InvoiceStatus) {
    if (status === 'finalized' && !validate()) return;
    const id  = existingDraft?.id ?? `inv-new-${Date.now()}`;
    const inv = toInvoice({ ...draft, invoiceStatus: status }, id, selectedCenter);
    onSave(inv);
  }

  const fld = (err?: string) => cn(
    'mt-1 block w-full text-sm bg-card border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
    err ? 'border-destructive' : 'border-border',
    isReadOnly && 'opacity-60 cursor-not-allowed',
  );

  const statusColor = INVOICE_STATUS_COLORS[draft.invoiceStatus] ?? 'bg-muted text-muted-foreground';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Modal
      onClose={onClose}
      overlayClassName="p-2 lg:p-4"
      className={styles.style6}
      closeOnEscape={false}
    >

        {/* Header */}
        <div className={styles.style7}>
          <div className={styles.style8}>
            <Receipt size={18} className={styles.style9} />
            <h2 className={styles.style10}>
              {existingDraft ? (isReadOnly ? 'View Invoice' : 'Edit Invoice') : 'New Invoice'}
            </h2>
            <span className={styles.style11}>
              {draft.invoiceNumber}
            </span>
            <span className={styles.style1Class(statusColor)}>
              {INVOICE_STATUS_LABELS[draft.invoiceStatus]}
            </span>
          </div>
          <IconButton icon={<X size={18} />} label="Close" onClick={onClose} />
        </div>

        {/* Body — single scroll, two-col grid on lg */}
        <div className={styles.style12}>
          <div className={styles.style13}>

            {/* ── Left column ── */}
            <div className={styles.style14}>

              {/* Invoice Header */}
              <div className={styles.style15}>
                <h3 className={styles.style16}>Invoice Header</h3>
                <div className={styles.style17}>

                  <div>
                    <label className={styles.style18}>Invoice Number</label>
                    <input readOnly value={draft.invoiceNumber}
                      className={styles.style19} />
                  </div>

                  <div>
                    <label className={styles.style18}>Invoice Date</label>
                    <input type="date" value={draft.invoiceDate} disabled={isReadOnly}
                      onChange={e => upd('invoiceDate', e.target.value)}
                      className={fld(errors.invoiceDate)} />
                    {errors.invoiceDate && <p className={styles.style20}>{errors.invoiceDate}</p>}
                  </div>

                  {/* Patient search */}
                  <div className={styles.style21}>
                    <label className={styles.style18}>Patient ID / Name *</label>
                    <input
                      value={patientSearch}
                      disabled={isReadOnly}
                      onChange={e => { setPatientSearch(e.target.value); upd('patientId', ''); setShowPatientDrop(true); }}
                      onFocus={() => setShowPatientDrop(true)}
                      onBlur={() => setTimeout(() => setShowPatientDrop(false), 150)}
                      placeholder="Search by name or patient ID…"
                      className={fld(errors.patientId)}
                    />
                    {errors.patientId && <p className={styles.style20}>{errors.patientId}</p>}
                    {showPatientDrop && filteredPatients.length > 0 && (
                      <div className={styles.style22}>
                        {filteredPatients.map(p => (
                          <button key={p.id} onMouseDown={() => selectPatient(p)}
                            className={styles.style23}>
                            <User size={14} className={styles.style24} />
                            <span className={styles.style25}>{p.name}</span>
                            <span className={styles.style26}>{p.id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.style27}>
                    <label className={styles.style18}>Patient Name</label>
                    <input readOnly value={selectedPatient?.name ?? '—'}
                      className={styles.style28} />
                  </div>

                  <div>
                    <label className={styles.style18}>Care Setting</label>
                    <select value={draft.careSetting} disabled={isReadOnly}
                      onChange={e => upd('careSetting', e.target.value as CareSetting)}
                      className={fld()}>
                      {(Object.keys(CARE_SETTING_LABELS) as CareSetting[]).map(k => (
                        <option key={k} value={k}>{CARE_SETTING_LABELS[k]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={styles.style18}>Visit Type</label>
                    <select value={draft.visitType} disabled={isReadOnly}
                      onChange={e => upd('visitType', e.target.value as AppointmentType)}
                      className={fld()}>
                      {(Object.keys(APPOINTMENT_TYPE_LABELS) as AppointmentType[]).map(k => (
                        <option key={k} value={k}>{APPOINTMENT_TYPE_LABELS[k]}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.style27}>
                    <label className={styles.style18}>Department</label>
                    <select value={draft.department} disabled={isReadOnly}
                      onChange={e => upd('department', e.target.value as Department)}
                      className={fld()}>
                      {(Object.keys(DEPARTMENT_LABELS) as Department[]).map(k => (
                        <option key={k} value={k}>{DEPARTMENT_LABELS[k]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Type */}
              <div className={styles.style15}>
                <h3 className={styles.style16}>Billing Type</h3>
                <select value={draft.billingType} disabled={isReadOnly}
                  onChange={e => upd('billingType', e.target.value as DraftForm['billingType'])}
                  className={fld()}>
                  <option value="itemized">Itemized</option>
                  <option value="package">Package</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <p className={styles.style29}>{BILLING_TYPE_HINTS[draft.billingType]}</p>
              </div>

              {/* Package (conditional) */}
              {showPackage && (
                <div className={styles.style30}>
                  <h3 className={styles.style16}>Package</h3>
                  <div className={styles.style17}>

                    <div className={styles.style27}>
                      <label className={styles.style18}>Package Name *</label>
                      <select value={draft.packageId} disabled={isReadOnly}
                        onChange={e => onPackageSelect(e.target.value)}
                        className={fld(errors.packageName)}>
                        <option value="">— Select package —</option>
                        {mockOncologyPackages.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      {errors.packageName && <p className={styles.style20}>{errors.packageName}</p>}
                    </div>

                    <div>
                      <label className={styles.style18}>Package Type</label>
                      <input value={draft.packageType} disabled={isReadOnly}
                        onChange={e => upd('packageType', e.target.value)}
                        className={fld()} />
                    </div>

                    <div>
                      <label className={styles.style18}>Package Amount (₹) *</label>
                      <input type="number" min={0} value={draft.packageAmount} disabled={isReadOnly}
                        onChange={e => upd('packageAmount', e.target.value)}
                        className={fld(errors.packageAmount)} />
                      {errors.packageAmount && <p className={styles.style20}>{errors.packageAmount}</p>}
                    </div>

                    <div>
                      <label className={styles.style18}>Start Date *</label>
                      <input type="date" value={draft.packageStart} disabled={isReadOnly}
                        onChange={e => upd('packageStart', e.target.value)}
                        className={fld(errors.packageStart)} />
                    </div>

                    <div>
                      <label className={styles.style18}>End Date *</label>
                      <input type="date" value={draft.packageEnd} disabled={isReadOnly}
                        onChange={e => upd('packageEnd', e.target.value)}
                        className={fld(errors.packageEnd)} />
                    </div>

                    <div className={styles.style27}>
                      <label className={styles.style31}>Inclusions</label>
                      <div className={styles.style32}>
                        {[
                          { key: 'inclDrugs'       as const, label: 'Drugs'       },
                          { key: 'inclProcedures'  as const, label: 'Procedures'  },
                          { key: 'inclConsumables' as const, label: 'Consumables' },
                        ].map(({ key, label }) => (
                          <label key={key} className={styles.style33}>
                            <input type="checkbox" checked={draft[key]} disabled={isReadOnly}
                              onChange={e => upd(key, e.target.checked)}
                              className={styles.style34} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Warning-styled extras field */}
                    <div className={styles.style27}>
                      <div className={styles.style35}>
                        <div className={styles.style36}>
                          <AlertTriangle size={14} className={styles.style37} />
                          <label className={styles.style38}>
                            Additional Items Outside Package (₹)
                          </label>
                        </div>
                        <input type="number" min={0} value={draft.packageExtras} disabled={isReadOnly}
                          onChange={e => upd('packageExtras', e.target.value)}
                          placeholder="0"
                          className={styles.style39} />
                        <p className={styles.style40}>Items billed outside the package scope.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Itemized Billing */}
              <div className={styles.style15}>
                <div className={styles.style41}>
                  <h3 className={styles.style42}>Itemized Billing</h3>
                  {!isReadOnly && (
                    <button onClick={addLineItem}
                      className={styles.style43}>
                      <Plus size={13} /> Add Item
                    </button>
                  )}
                </div>
                {errors.lineItems && <p className={styles.style44}>{errors.lineItems}</p>}
                {draft.lineItems.length === 0 ? (
                  <p className={styles.style45}>
                    {draft.billingType === 'package' ? 'Package billing — no line items required' : 'No items added yet'}
                  </p>
                ) : (
                  <div className={styles.style46}>
                    <table className={styles.style47}>
                      <thead>
                        <tr className={styles.style48}>
                          {['Item Name', 'Category', 'Qty', 'Unit Price (₹)', 'Total', 'Status', ''].map(h => (
                            <th key={h} className={styles.style49}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={styles.style50}>
                        {draft.lineItems.map((item, i) => (
                          <tr key={item.id} className={styles.style51}>
                            <td className={styles.style52}>
                              <input value={item.name} disabled={isReadOnly}
                                onChange={e => updLine(item.id, { name: e.target.value })}
                                placeholder="Item name"
                                className={styles.style2Class(errors[`li_name_${i}`] ? 'border-destructive' : 'border-border')} />
                            </td>
                            <td className={styles.style52}>
                              <select value={item.category} disabled={isReadOnly}
                                onChange={e => updLine(item.id, { category: e.target.value as CostCategory })}
                                className={styles.style53}>
                                {(Object.keys(COST_CATEGORY_LABELS) as CostCategory[]).map(k => (
                                  <option key={k} value={k}>{COST_CATEGORY_LABELS[k]}</option>
                                ))}
                              </select>
                            </td>
                            <td className={styles.style54}>
                              <input type="number" min={1} value={item.qty} disabled={isReadOnly}
                                onChange={e => updLine(item.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                                className={styles.style55} />
                            </td>
                            <td className={styles.style56}>
                              <input type="number" min={0} value={item.unitPrice || ''} disabled={isReadOnly}
                                onChange={e => updLine(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                                placeholder="0"
                                className={styles.style2Class(errors[`li_price_${i}`] ? 'border-destructive' : 'border-border')} />
                            </td>
                            <td className={styles.style57}>
                              ₹{item.total.toLocaleString('en-IN')}
                            </td>
                            <td className={styles.style52}>
                              <button disabled={isReadOnly}
                                onClick={() => updLine(item.id, { status: item.status === 'included' ? 'extra' : 'included' })}
                                className={styles.style3Class(item.status === 'included'
                                    ? 'bg-teal-soft text-teal-emphasis hover:bg-teal-border'
                                    : 'bg-warning-soft text-warning-emphasis hover:bg-warning-border',
                                  isReadOnly && 'cursor-default pointer-events-none',
                                )}>
                                {item.status === 'included' ? 'Included' : 'Extra'}
                              </button>
                            </td>
                            <td className={styles.style58}>
                              {!isReadOnly && (
                                <button onClick={() => removeLine(item.id)}
                                  className={styles.style59}>
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Payment Collection */}
              <div className={styles.style15}>
                <div className={styles.style41}>
                  <h3 className={styles.style42}>Payment Collection</h3>
                  {!isReadOnly && (
                    <button onClick={addPayment}
                      className={styles.style43}>
                      <Plus size={13} /> Add Payment
                    </button>
                  )}
                </div>
                {draft.payments.length === 0 ? (
                  <p className={styles.style60}>No payments recorded</p>
                ) : (
                  <div className={styles.style61}>
                    {draft.payments.map(row => (
                      <div key={row.id} className={styles.style62}>
                        <select value={row.mode} disabled={isReadOnly}
                          onChange={e => updPayment(row.id, { mode: e.target.value as PaymentMode })}
                          className={styles.style63}>
                          {(Object.keys(PAYMENT_MODE_LABELS) as PaymentMode[]).map(m => (
                            <option key={m} value={m}>{PAYMENT_MODE_LABELS[m]}</option>
                          ))}
                        </select>
                        <input type="date" value={row.date} disabled={isReadOnly}
                          onChange={e => updPayment(row.id, { date: e.target.value })}
                          className={styles.style64} />
                        <input type="number" min={0} value={row.amount || ''} disabled={isReadOnly}
                          onChange={e => updPayment(row.id, { amount: parseFloat(e.target.value) || 0 })}
                          placeholder="Amount"
                          className={styles.style65} />
                        {!isReadOnly && (
                          <button onClick={() => removePayment(row.id)}
                            className={styles.style66}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>{/* end left col */}

            {/* ── Right column ── */}
            <div className={styles.style67}>

              {/* Amount Summary */}
              <div className={styles.style15}>
                <h3 className={styles.style16}>Amount Summary</h3>
                <div className={styles.style68}>
                  <div className={styles.style69}>
                    <span className={styles.style70}>Gross Amount</span>
                    <span className={styles.style71}>{formatCurrency(gross)}</span>
                  </div>
                  <div className={styles.style72}>
                    <span className={styles.style70}>Discount (–)</span>
                    <div className={styles.style73}>
                      <span className={styles.style18}>₹</span>
                      <input type="number" min={0} value={draft.discount} disabled={isReadOnly}
                        onChange={e => upd('discount', e.target.value)}
                        placeholder="0"
                        className={styles.style74} />
                    </div>
                  </div>
                  <div className={styles.style75}>
                    <div className={styles.style69}>
                      <span className={styles.style70}>Net Payable</span>
                      <span className={styles.style76}>{formatCurrency(netPayable)}</span>
                    </div>
                    <div className={styles.style69}>
                      <span className={styles.style70}>Paid Amount</span>
                      <span className={styles.style71}>{formatCurrency(paidAmt)}</span>
                    </div>
                    <div className={styles.style77}>
                      <span className={styles.style78}>Balance</span>
                      <span className={styles.style4Class(balance > 0 ? 'text-destructive' : 'text-success-emphasis-mid')}>
                        {formatCurrency(balance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payor & Approval */}
              <div className={styles.style15}>
                <h3 className={styles.style16}>Payor & Approval</h3>
                <div className={styles.style79}>
                  <div>
                    <label className={styles.style18}>Payor Type</label>
                    <select value={draft.payorType} disabled={isReadOnly}
                      onChange={e => upd('payorType', e.target.value as DraftForm['payorType'])}
                      className={fld()}>
                      <option value="self-pay">Self Pay</option>
                      <option value="insurance">Insurance</option>
                      <option value="corporate">Corporate</option>
                      <option value="government">Government Scheme</option>
                    </select>
                  </div>
                  {draft.payorType === 'self-pay' && (
                    <>
                      <div>
                        <label className={styles.style18}>Payment Method</label>
                        <select value={draft.selfPayMethod} disabled={isReadOnly}
                          onChange={e => upd('selfPayMethod', e.target.value as SelfPayMethod)}
                          className={fld()}>
                          {(Object.keys(SELF_PAY_METHOD_LABELS) as SelfPayMethod[]).map(m => (
                            <option key={m} value={m}>{SELF_PAY_METHOD_LABELS[m]}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={styles.style18}>Transaction ID</label>
                        <input value={draft.transactionId} disabled={isReadOnly}
                          onChange={e => upd('transactionId', e.target.value)}
                          placeholder="Enter transaction / reference ID"
                          className={fld()} />
                      </div>
                    </>
                  )}
                  {draft.payorType === 'insurance' && (
                    <div>
                      <label className={styles.style18}>Insurance TPA Name *</label>
                      <input value={draft.insuranceTpaName} disabled={isReadOnly}
                        onChange={e => upd('insuranceTpaName', e.target.value)}
                        placeholder="e.g. Star Health, ICICI Lombard"
                        className={fld(errors.insuranceTpaName)} />
                      {errors.insuranceTpaName && <p className={styles.style20}>{errors.insuranceTpaName}</p>}
                    </div>
                  )}
                  {draft.payorType === 'corporate' && (
                    <div>
                      <label className={styles.style18}>Corporate Name *</label>
                      <input value={draft.corporateName} disabled={isReadOnly}
                        onChange={e => upd('corporateName', e.target.value)}
                        className={fld(errors.corporateName)} />
                      {errors.corporateName && <p className={styles.style20}>{errors.corporateName}</p>}
                    </div>
                  )}
                  {draft.payorType === 'government' && (
                    <div>
                      <label className={styles.style18}>Scheme Name *</label>
                      <input value={draft.schemeName} disabled={isReadOnly}
                        onChange={e => upd('schemeName', e.target.value)}
                        className={fld(errors.schemeName)} />
                      {errors.schemeName && <p className={styles.style20}>{errors.schemeName}</p>}
                    </div>
                  )}
                  {showPayorExtra && (
                    <>
                      <div>
                        <label className={styles.style18}>Pre-auth Status</label>
                        <select value={draft.preAuthStatus} disabled={isReadOnly}
                          onChange={e => upd('preAuthStatus', e.target.value as PreAuthStatus)}
                          className={fld()}>
                          {(Object.keys(PRE_AUTH_STATUS_LABELS) as PreAuthStatus[]).map(k => (
                            <option key={k} value={k}>{PRE_AUTH_STATUS_LABELS[k]}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={styles.style18}>Approved Amount (₹)</label>
                        <input type="number" min={0} value={draft.approvedAmount} disabled={isReadOnly}
                          onChange={e => upd('approvedAmount', e.target.value)}
                          placeholder="0"
                          className={fld()} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Statuses + Alerts */}
              <div className={styles.style15}>
                <h3 className={styles.style16}>Statuses</h3>
                <div className={styles.style79}>

                  <div>
                    <label className={styles.style18}>Invoice Status</label>
                    <select value={draft.invoiceStatus} disabled={isReadOnly}
                      onChange={e => upd('invoiceStatus', e.target.value as InvoiceStatus)}
                      className={fld()}>
                      {(Object.keys(INVOICE_STATUS_LABELS) as InvoiceStatus[]).map(k => (
                        <option key={k} value={k}>{INVOICE_STATUS_LABELS[k]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={styles.style18}>Payment Status</label>
                    <select value={draft.invoicePmtStatus} disabled={isReadOnly}
                      onChange={e => upd('invoicePmtStatus', e.target.value as InvoicePmtStatus)}
                      className={fld()}>
                      {draft.payorType === 'self-pay' ? (
                        <>
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                          <option value="waived">Waived</option>
                        </>
                      ) : (
                        <>
                          <option value="paid">Authorized</option>
                          <option value="partially-paid">Pre-Authorized</option>
                          <option value="unpaid">Pending Authorization</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className={styles.style18}>Refund Status</label>
                    <select value={draft.refundStatus} disabled={isReadOnly}
                      onChange={e => upd('refundStatus', e.target.value as RefundStatus)}
                      className={fld()}>
                      {(Object.keys(REFUND_STATUS_LABELS) as RefundStatus[]).map(k => (
                        <option key={k} value={k}>{REFUND_STATUS_LABELS[k]}</option>
                      ))}
                    </select>
                  </div>

                  {showPackage && (
                    <div className={styles.style80}>
                      <label className={styles.style18}>Package Status</label>
                      <select value={draft.packageStatus} disabled={isReadOnly}
                        onChange={e => upd('packageStatus', e.target.value as PackageStatus)}
                        className={fld()}>
                        {(Object.keys(PACKAGE_STATUS_LABELS) as PackageStatus[]).map(k => (
                          <option key={k} value={k}>{PACKAGE_STATUS_LABELS[k]}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {showPayorExtra && (
                    <div className={styles.style80}>
                      <label className={styles.style18}>Insurance / Corp Status</label>
                      <select value={draft.insuranceCorpStatus} disabled={isReadOnly}
                        onChange={e => upd('insuranceCorpStatus', e.target.value as ClaimStatus | '')}
                        className={fld()}>
                        <option value="">— Not set —</option>
                        {(Object.keys(CLAIM_STATUS_LABELS) as ClaimStatus[]).map(k => (
                          <option key={k} value={k}>{CLAIM_STATUS_LABELS[k]}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Alerts panel */}
                  <div className={cn(
                    'mt-1 rounded-lg p-3 border transition-colors',
                    alerts.length > 0 ? 'bg-warning-surface-soft border-warning-surface-border' : 'bg-muted/30 border-border',
                  )}>
                    <p className={styles.style81}>
                      {alerts.length > 0 ? '⚠ Active Alerts' : 'Alerts'}
                    </p>
                    {alerts.length === 0 ? (
                      <p className={styles.style18}>No active alerts</p>
                    ) : (
                      <div className={styles.style61}>
                        {alerts.map((a, i) => (
                          <div key={i}>
                            <p className={styles.style38}>{a.title}</p>
                            <p className={styles.style82}>{a.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>{/* end right col */}
          </div>
        </div>

        {/* Action Bar */}
        {!isReadOnly && (
          <div className={styles.style83}>
            <button onClick={validate}
              className={styles.style84}>
              <ArrowUpRight size={15} /> Validate
            </button>
            <div className={styles.style8}>
              <button onClick={() => handleSave('draft')}
                className={styles.style85}>
                <Save size={15} /> Save Draft
              </button>
              <button onClick={() => handleSave('finalized')}
                className={styles.style86}>
                <CheckCircle2 size={15} /> Finalize Invoice
              </button>
            </div>
          </div>
        )}
    </Modal>
  );
}
