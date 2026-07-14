import * as styles from './GenerateInvoiceOverlay.styles';
import { useState } from 'react';
import { Receipt } from 'bfd-icons';
import type { Appointment, PaymentType, PaymentStatus, SelfPayMethod } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, PAYMENT_TYPE_LABELS, SELF_PAY_METHOD_LABELS } from 'bfd-core';
import { VISIT_CHARGES, formatCurrency } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { Doctor } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';

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

        <ModalBody className={styles.style1}>

          {/* Visit summary */}
          <section>
            <p className={styles.style2}>Visit Summary</p>
            <div className={styles.style3}>
              {[
                { label: 'Patient',    value: patient.name        },
                { label: 'Visit ID',   value: appointment.visitId },
                { label: 'Doctor',     value: doctor.name         },
                { label: 'Center',     value: appointment.center  },
                { label: 'Visit Type', value: APPOINTMENT_TYPE_LABELS[appointment.type] },
                { label: 'Date & Time',value: `${formatDate(appointment.date)} · ${formatTime(appointment.time)}` },
              ].map(r => (
                <div key={r.label}>
                  <p className={styles.style4}>{r.label}</p>
                  <p className={styles.style5}>{r.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Charges */}
          <section>
            <p className={styles.style2}>Charges</p>
            <div className={styles.style6}>
              <div className={styles.style7}>
                <span className={styles.style8}>Visit Charges</span>
                <span className={styles.style9}>{formatCurrency(baseCharge)}</span>
              </div>

              {/* Additional charges */}
              <div className={styles.style10}>
                <span className={styles.style8}>Additional Charges</span>
                <div className={styles.style11}>
                  <span className={styles.style8}>₹</span>
                  <input
                    type="number"
                    min="0"
                    value={form.additionalCharges || ''}
                    placeholder="0"
                    onChange={e => setField('additionalCharges', parseAmount(e.target.value))}
                    className={styles.style12}
                  />
                </div>
              </div>

              {/* Discount */}
              <div className={styles.style10}>
                <span className={styles.style8}>Discount</span>
                <div className={styles.style11}>
                  <span className={styles.style8}>₹</span>
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
                <p className={styles.style13}>{errors.discount}</p>
              )}

              {/* Total */}
              <div className={styles.style14}>
                <span className={styles.style9}>Total</span>
                <span className={styles.style15}>{formatCurrency(total)}</span>
              </div>
            </div>
          </section>

          {/* Payment details */}
          <section>
            <p className={styles.style16}>Payment Details</p>
            <div className={styles.style17}>

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

          <p className={styles.style18}>
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
