import * as styles from './PaymentDetailsSubTab.styles';
import { useState } from 'react';
import { CreditCard, Plus, X } from 'bfd-icons';

import type { PaymentRecord, PaymentMode } from 'bfd-core';
import { PAYMENT_MODE_LABELS } from 'bfd-core';
import type { Invoice } from 'bfd-core';
import { cn } from 'bfd-core';

interface Props {
  patientId:      string;
  invoices:       Invoice[];
  payments:       PaymentRecord[];
  onPaymentsChange: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
}

function fmtCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className={styles.style2}>
      {children}{required && <span className={styles.style3}>*</span>}
    </label>
  );
}

const PAYMENT_MODE_OPTIONS = Object.keys(PAYMENT_MODE_LABELS) as PaymentMode[];

interface AddPaymentOverlayProps {
  patientId: string;
  invoices:  Invoice[];
  onSave:    (payment: PaymentRecord) => void;
  onClose:   () => void;
}

function AddPaymentOverlay({ patientId, invoices, onSave, onClose }: AddPaymentOverlayProps) {
  const today = new Date().toISOString().split('T')[0];
  const [invoiceId,      setInvoiceId]      = useState('');
  const [amount,         setAmount]         = useState('');
  const [mode,           setMode]           = useState<PaymentMode>('cash');
  const [date,           setDate]           = useState(today);
  const [transactionRef, setTransactionRef] = useState('');
  const [notes,          setNotes]          = useState('');

  const canSave = invoiceId && amount && Number(amount) > 0;

  function handleSave() {
    if (!canSave) return;
    onSave({
      id:              `pr-${Date.now()}`,
      patientId,
      invoiceId,
      amount:          Number(amount),
      mode,
      date,
      transactionRef:  transactionRef || undefined,
      notes:           notes || undefined,
      recordedBy:      'Staff',
    });
  }

  return (
    <div className={styles.style4}>
      <div className={styles.style5}>
        <div className={styles.style6}>
          <h3 className={styles.style7}>Record Payment</h3>
          <button onClick={onClose} className={styles.style8}><X size={16} /></button>
        </div>
        <div className={styles.style9}>
          <div>
            <FieldLabel required>Invoice</FieldLabel>
            <select value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
              className={styles.style10}>
              <option value="">Select invoice…</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — ₹{(inv.visitCharges + inv.additionalCharges - inv.discount).toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.style11}>
            <div>
              <FieldLabel required>Amount (₹)</FieldLabel>
              <input type="number" min={0} value={amount} onChange={e => setAmount(e.target.value)}
                className={styles.style10} />
            </div>
            <div>
              <FieldLabel required>Date</FieldLabel>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className={styles.style10} />
            </div>
          </div>
          <div>
            <FieldLabel required>Payment Mode</FieldLabel>
            <div className={styles.style12}>
              {PAYMENT_MODE_OPTIONS.map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={cn(
                    'px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all',
                    mode === m
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  )}>
                  {PAYMENT_MODE_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>Transaction Reference</FieldLabel>
            <input value={transactionRef} onChange={e => setTransactionRef(e.target.value)}
              placeholder="UPI ID / Cheque No. / Transaction ID"
              className={styles.style13} />
          </div>
          <div>
            <FieldLabel>Notes</FieldLabel>
            <input value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Optional note"
              className={styles.style13} />
          </div>
        </div>
        <div className={styles.style14}>
          <button onClick={onClose} className={styles.style15}>Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className={styles.style16}>
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentDetailsSubTab({ patientId, invoices, payments, onPaymentsChange }: Props) {
  const [addOpen, setAddOpen] = useState(false);

  const totalBilled     = invoices.reduce((s, i) => s + i.visitCharges + i.additionalCharges - i.discount, 0);
  const totalPaid       = payments.reduce((s, p) => s + p.amount, 0);
  const outstanding     = totalBilled - totalPaid;
  const paymentsDone    = payments.length;
  const lastPayment     = [...payments].sort((a, b) => b.date.localeCompare(a.date))[0];
  const sorted          = [...payments].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className={styles.style17}>
        {/* 4 KPI cards */}
        <div className={styles.style18}>
          {[
            { label: 'Total Paid',     value: fmtCurrency(totalPaid),    color: 'text-success-emphasis-mid'   },
            { label: 'Outstanding',    value: fmtCurrency(Math.max(0, outstanding)), color: outstanding > 0 ? 'text-destructive' : 'text-success-emphasis-mid' },
            { label: 'Payments Done',  value: String(paymentsDone),      color: 'text-foreground'  },
            { label: 'Last Payment',   value: lastPayment ? fmtDate(lastPayment.date) : '—', color: 'text-muted-foreground text-sm' },
          ].map(s => (
            <div key={s.label} className={styles.style19}>
              <p className={styles.style20}>{s.label}</p>
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className={styles.style21}>
          <button onClick={() => setAddOpen(true)}
            className={styles.style22}>
            <Plus size={15} /> Record Payment
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className={styles.style23}>
            <CreditCard size={32} className={styles.style24} />
            <p className={styles.style25}>No payment records</p>
            <p className={styles.style26}>Payment transactions will be listed here.</p>
          </div>
        ) : (
          <div className={styles.style27}>
            <table className={styles.style28}>
              <thead>
                <tr className={styles.style29}>
                  {['Date', 'Invoice', 'Mode', 'Reference', 'Amount'].map(h => (
                    <th key={h} className={styles.style30}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(p => {
                  const inv = invoices.find(i => i.id === p.invoiceId);
                  return (
                    <tr key={p.id} className={styles.style31}>
                      <td className={styles.style32}>{fmtDate(p.date)}</td>
                      <td className={styles.style33}>{inv?.invoiceNumber ?? p.invoiceId}</td>
                      <td className={styles.style34}>{PAYMENT_MODE_LABELS[p.mode]}</td>
                      <td className={styles.style35}>{p.transactionRef ?? '—'}</td>
                      <td className={styles.style36}>{fmtCurrency(p.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={styles.style37}>
                  <td colSpan={4} className={styles.style38}>Total Recorded</td>
                  <td className={styles.style39}>{fmtCurrency(totalPaid)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {addOpen && (
        <AddPaymentOverlay
          patientId={patientId}
          invoices={invoices}
          onSave={p => {
            onPaymentsChange(prev => [...prev, p]);
            setAddOpen(false);
          }}
          onClose={() => setAddOpen(false)}
        />
      )}
    </>
  );
}
