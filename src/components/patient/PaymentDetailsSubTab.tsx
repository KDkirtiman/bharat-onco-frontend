import { useState } from 'react';
import { CreditCard, Plus, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { PaymentRecord, PaymentMode } from '../../datapoints/billing';
import { PAYMENT_MODE_LABELS } from '../../datapoints/billing';
import type { Invoice } from '../../datapoints/billing';

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
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
      {children}{required && <span className="text-destructive ml-0.5">*</span>}
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Record Payment</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <FieldLabel required>Invoice</FieldLabel>
            <select value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select invoice…</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — ₹{(inv.visitCharges + inv.additionalCharges - inv.discount).toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Amount (₹)</FieldLabel>
              <input type="number" min={0} value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <FieldLabel required>Date</FieldLabel>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <FieldLabel required>Payment Mode</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <FieldLabel>Notes</FieldLabel>
            <input value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Optional note"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
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
      <div className="space-y-5">
        {/* 4 KPI cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Paid',     value: fmtCurrency(totalPaid),    color: 'text-green-600'   },
            { label: 'Outstanding',    value: fmtCurrency(Math.max(0, outstanding)), color: outstanding > 0 ? 'text-destructive' : 'text-green-600' },
            { label: 'Payments Done',  value: String(paymentsDone),      color: 'text-foreground'  },
            { label: 'Last Payment',   value: lastPayment ? fmtDate(lastPayment.date) : '—', color: 'text-muted-foreground text-sm' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-end">
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={15} /> Record Payment
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CreditCard size={32} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No payment records</p>
            <p className="text-xs text-muted-foreground mt-1">Payment transactions will be listed here.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  {['Date', 'Invoice', 'Mode', 'Reference', 'Amount'].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(p => {
                  const inv = invoices.find(i => i.id === p.invoiceId);
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">{fmtDate(p.date)}</td>
                      <td className="py-3 px-4 text-sm font-mono text-primary">{inv?.invoiceNumber ?? p.invoiceId}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{PAYMENT_MODE_LABELS[p.mode]}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{p.transactionRef ?? '—'}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600 whitespace-nowrap">{fmtCurrency(p.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td colSpan={4} className="py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Recorded</td>
                  <td className="py-2.5 px-4 text-sm font-bold text-foreground">{fmtCurrency(totalPaid)}</td>
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
