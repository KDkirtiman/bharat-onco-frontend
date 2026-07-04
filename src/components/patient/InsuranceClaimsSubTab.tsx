import { useState } from 'react';
import { ShieldCheck, Plus, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { InsuranceClaim, ClaimStatus } from '../../datapoints/billing';
import { CLAIM_STATUS_LABELS, CLAIM_STATUS_COLORS } from '../../datapoints/billing';
import type { Invoice } from '../../datapoints/billing';

interface Props {
  patientId:    string;
  invoices:     Invoice[];
  claims:       InsuranceClaim[];
  onClaimsChange: React.Dispatch<React.SetStateAction<InsuranceClaim[]>>;
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

const CLAIM_STATUS_OPTIONS = Object.keys(CLAIM_STATUS_LABELS) as ClaimStatus[];

interface AddClaimOverlayProps {
  patientId: string;
  invoices:  Invoice[];
  onSave:    (claim: InsuranceClaim) => void;
  onClose:   () => void;
}

function AddInsuranceClaimOverlay({ patientId, invoices, onSave, onClose }: AddClaimOverlayProps) {
  const today = new Date().toISOString().split('T')[0];
  const [invoiceId,      setInvoiceId]      = useState('');
  const [insurerName,    setInsurerName]    = useState('');
  const [policyNumber,   setPolicyNumber]   = useState('');
  const [claimNumber,    setClaimNumber]    = useState('');
  const [claimedAmount,  setClaimedAmount]  = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [status,         setStatus]         = useState<ClaimStatus>('submitted');
  const [submittedDate,  setSubmittedDate]  = useState(today);
  const [settledDate,    setSettledDate]    = useState('');
  const [remarks,        setRemarks]        = useState('');

  const canSave = invoiceId && insurerName.trim() && policyNumber.trim() && claimNumber.trim() && claimedAmount;

  function handleSave() {
    if (!canSave) return;
    onSave({
      id:              `ic-${Date.now()}`,
      patientId,
      invoiceId,
      insurerName:     insurerName.trim(),
      policyNumber:    policyNumber.trim(),
      claimNumber:     claimNumber.trim(),
      claimedAmount:   Number(claimedAmount),
      approvedAmount:  approvedAmount ? Number(approvedAmount) : undefined,
      status,
      submittedDate,
      settledDate:     settledDate || undefined,
      remarks:         remarks || undefined,
      timeline:        [{ step: status, completedAt: submittedDate, status: 'current' as const, note: 'Claim filed' }],
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h3 className="text-sm font-bold text-foreground">File Insurance Claim</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <FieldLabel required>Invoice</FieldLabel>
            <select value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select invoice…</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.invoiceNumber} — ₹{(inv.visitCharges + inv.additionalCharges - inv.discount).toLocaleString('en-IN')}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Insurer Name</FieldLabel>
              <input value={insurerName} onChange={e => setInsurerName(e.target.value)}
                placeholder="e.g. Star Health"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <FieldLabel required>Policy Number</FieldLabel>
              <input value={policyNumber} onChange={e => setPolicyNumber(e.target.value)}
                placeholder="e.g. SH-2024-001234"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Claim Number</FieldLabel>
              <input value={claimNumber} onChange={e => setClaimNumber(e.target.value)}
                placeholder="e.g. CLM-SH-20240310-0042"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <FieldLabel required>Submitted Date</FieldLabel>
              <input type="date" value={submittedDate} onChange={e => setSubmittedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Claimed Amount (₹)</FieldLabel>
              <input type="number" min={0} value={claimedAmount} onChange={e => setClaimedAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <FieldLabel>Approved Amount (₹)</FieldLabel>
              <input type="number" min={0} value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Claim Status</FieldLabel>
              <select value={status} onChange={e => setStatus(e.target.value as ClaimStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                {CLAIM_STATUS_OPTIONS.map(s => <option key={s} value={s}>{CLAIM_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Settlement Date</FieldLabel>
              <input type="date" value={settledDate} onChange={e => setSettledDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <FieldLabel>Remarks</FieldLabel>
            <textarea rows={2} value={remarks} onChange={e => setRemarks(e.target.value)}
              placeholder="Notes on approval, rejection reason, etc."
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
            File Claim
          </button>
        </div>
      </div>
    </div>
  );
}

export function InsuranceClaimsSubTab({ patientId, invoices, claims, onClaimsChange }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const sorted = [...claims].sort((a, b) => b.submittedDate.localeCompare(a.submittedDate));

  const totalClaimed  = claims.reduce((s, c) => s + c.claimedAmount, 0);
  const totalApproved = claims.reduce((s, c) => s + (c.approvedAmount ?? 0), 0);
  const pending       = claims.filter(c => c.status === 'submitted' || c.status === 'under-review').length;

  return (
    <>
      <div className="space-y-5">
        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Claimed',  value: fmtCurrency(totalClaimed),  color: 'text-foreground'  },
            { label: 'Total Approved', value: fmtCurrency(totalApproved), color: 'text-green-600'   },
            { label: 'Pending Claims', value: String(pending),            color: pending > 0 ? 'text-amber-600' : 'text-muted-foreground' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-end">
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={15} /> File Claim
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldCheck size={32} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No insurance claims on record</p>
            <p className="text-xs text-muted-foreground mt-1">Filed claims will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(claim => (
              <div key={claim.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{claim.insurerName}</p>
                    <p className="text-xs text-muted-foreground">Policy: {claim.policyNumber} · Claim: {claim.claimNumber}</p>
                  </div>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium shrink-0', CLAIM_STATUS_COLORS[claim.status])}>
                    {CLAIM_STATUS_LABELS[claim.status]}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Claimed</p>
                    <p className="font-semibold text-foreground">{fmtCurrency(claim.claimedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Approved</p>
                    <p className={cn('font-semibold', claim.approvedAmount !== undefined ? 'text-green-600' : 'text-muted-foreground')}>
                      {claim.approvedAmount !== undefined ? fmtCurrency(claim.approvedAmount) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Submitted</p>
                    <p className="text-muted-foreground">{fmtDate(claim.submittedDate)}</p>
                  </div>
                </div>
                {claim.remarks && (
                  <div className="border-t border-border pt-2">
                    <p className="text-xs text-muted-foreground italic">{claim.remarks}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {addOpen && (
        <AddInsuranceClaimOverlay
          patientId={patientId}
          invoices={invoices}
          onSave={claim => {
            onClaimsChange(prev => [...prev, claim]);
            setAddOpen(false);
          }}
          onClose={() => setAddOpen(false)}
        />
      )}
    </>
  );
}
