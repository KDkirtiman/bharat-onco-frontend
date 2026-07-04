import { useState } from 'react';
import { Receipt } from 'lucide-react';
import type { Appointment, PaymentType, PaymentStatus, SelfPayMethod } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS, PAYMENT_TYPE_LABELS, SELF_PAY_METHOD_LABELS } from '../../datapoints/scheduling';
import { VISIT_CHARGES, formatCurrency } from '../../datapoints/billing';
import type { Patient } from '../../datapoints/patients';
import type { Doctor } from '../../datapoints/scheduling';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Select } from '../../components/controls/Select';
import { TextField } from '../../components/controls/TextField';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';

export interface GenerateInvoiceFormData {
  paymentType:       PaymentType;
  paymentStatus:     PaymentStatus;
  paymentMethod?:    SelfPayMethod;
  transactionId?:    string;
  additionalCharges: number;
  discount:          number;
}

interface Props {
  appointment: Appointment;
  patient:     Patient;
  doctor:      Doctor;
  onConfirm:   (data: GenerateInvoiceFormData) => void;
  onClose:     () => void;
}

const PAYMENT_TYPES: PaymentType[] = ['self-pay', 'insurance', 'corporate', 'government'];

const SELF_PAY_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'paid',    label: 'Paid'    },
  { value: 'pending', label: 'Unpaid'  },
  { value: 'waived',  label: 'Waived'  },
];

const THIRD_PARTY_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'paid',     label: 'Authorized'           },
  { value: 'pre-auth', label: 'Pre-Authorized'        },
  { value: 'pending',  label: 'Pending Authorization' },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
}

export function GenerateInvoiceOverlay({ appointment, patient, doctor, onConfirm, onClose }: Props) {
  const baseCharge = VISIT_CHARGES[appointment.type];

  const [form, setForm] = useState<GenerateInvoiceFormData>({
    paymentType:       'self-pay',
    paymentStatus:     baseCharge === 0 ? 'waived' : 'pending',
    paymentMethod:     'cash',
    transactionId:     '',
    additionalCharges: 0,
    discount:          0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GenerateInvoiceFormData, string>>>({});

  const total = Math.max(0, baseCharge + form.additionalCharges - form.discount);

  function setField<K extends keyof GenerateInvoiceFormData>(key: K, value: GenerateInvoiceFormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function parseAmount(raw: string): number {
    const n = parseFloat(raw);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.paymentType)   e.paymentType   = 'Payment type is required';
    if (!form.paymentStatus) e.paymentStatus = 'Payment status is required';
    if (form.discount > baseCharge + form.additionalCharges)
      e.discount = 'Discount cannot exceed total charges';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <Modal size="md" onClose={onClose} overlayClassName="bg-black/50" closeOnEscape={false}>

        {/* Header */}
        <ModalHeader title="Generate Invoice" icon={<Receipt size={16} />} onClose={onClose} />

        <ModalBody className="space-y-5">

          {/* Visit summary */}
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Visit Summary</p>
            <div className="bg-muted/40 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              {[
                { label: 'Patient',    value: patient.name        },
                { label: 'Visit ID',   value: appointment.visitId },
                { label: 'Doctor',     value: doctor.name         },
                { label: 'Center',     value: appointment.center  },
                { label: 'Visit Type', value: APPOINTMENT_TYPE_LABELS[appointment.type] },
                { label: 'Date & Time',value: `${formatDate(appointment.date)} · ${formatTime(appointment.time)}` },
              ].map(r => (
                <div key={r.label}>
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5 break-all">{r.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Charges */}
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Charges</p>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
                <span className="text-sm text-muted-foreground">Visit Charges</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(baseCharge)}</span>
              </div>

              {/* Additional charges */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60">
                <span className="text-sm text-muted-foreground">Additional Charges</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={form.additionalCharges || ''}
                    placeholder="0"
                    onChange={e => setField('additionalCharges', parseAmount(e.target.value))}
                    className="w-24 text-sm text-right px-2 py-1 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60">
                <span className="text-sm text-muted-foreground">Discount</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={form.discount || ''}
                    placeholder="0"
                    onChange={e => setField('discount', parseAmount(e.target.value))}
                    className={`w-24 text-sm text-right px-2 py-1 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.discount ? 'border-destructive' : 'border-border'}`}
                  />
                </div>
              </div>
              {errors.discount && (
                <p className="text-xs text-destructive px-4 pb-2">{errors.discount}</p>
              )}

              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-primary/5">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-base font-bold text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </section>

          {/* Payment details */}
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Payment Details</p>
            <div className="space-y-4">

              {/* Payment Type */}
              <FormField label="Payment Type" required error={errors.paymentType}>
                <Select
                  value={form.paymentType}
                  error={!!errors.paymentType}
                  onChange={e => {
                    const t = e.target.value as PaymentType;
                    const defaultStatus: PaymentStatus = t === 'self-pay' ? 'pending' : 'pending';
                    setForm(f => ({ ...f, paymentType: t, paymentStatus: defaultStatus, paymentMethod: t === 'self-pay' ? (f.paymentMethod ?? 'cash') : undefined }));
                    setErrors(er => ({ ...er, paymentType: undefined }));
                  }}
                >
                  {PAYMENT_TYPES.map(t => (
                    <option key={t} value={t}>{PAYMENT_TYPE_LABELS[t]}</option>
                  ))}
                </Select>
              </FormField>

              {/* Self-pay method + transaction ID */}
              {form.paymentType === 'self-pay' && (
                <>
                  <FormField label="Payment Method">
                    <Select
                      value={form.paymentMethod ?? 'cash'}
                      onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as SelfPayMethod }))}
                    >
                      {(Object.keys(SELF_PAY_METHOD_LABELS) as SelfPayMethod[]).map(m => (
                        <option key={m} value={m}>{SELF_PAY_METHOD_LABELS[m]}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Transaction ID">
                    <TextField
                      type="text"
                      value={form.transactionId ?? ''}
                      onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))}
                      placeholder="Enter transaction / reference ID"
                    />
                  </FormField>
                </>
              )}

              {/* Payment Status — options vary by payor type */}
              <FormField label="Payment Status" required error={errors.paymentStatus}>
                <Select
                  value={form.paymentStatus}
                  error={!!errors.paymentStatus}
                  onChange={e => setField('paymentStatus', e.target.value as PaymentStatus)}
                >
                  {(form.paymentType === 'self-pay' ? SELF_PAY_STATUSES : THIRD_PARTY_STATUSES).map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </FormField>

            </div>
          </section>

          <p className="text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            Confirming will generate an invoice and change the visit status to <strong>Confirmed</strong>.
          </p>

        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (validate()) onConfirm(form); }}>
            Confirm &amp; Generate Invoice
          </Button>
        </ModalFooter>

    </Modal>
  );
}
