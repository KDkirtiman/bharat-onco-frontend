import * as styles from './InsuranceClaimsSubTab.styles';
import { useState } from 'react';
import { ShieldCheck, Plus, X } from 'bfd-icons';

import type { InsuranceClaim, ClaimStatus } from 'bfd-core';
import { CLAIM_STATUS_LABELS, CLAIM_STATUS_COLORS } from 'bfd-core';
import type { Invoice } from 'bfd-core';

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
    <label className={styles.style3}>
      {children}{required && <span className={styles.style4}>*</span>}
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
    <div className={styles.style5}>
      <div className={styles.style6}>
        <div className={styles.style7}>
          <h3 className={styles.style8}>File Insurance Claim</h3>
          <button onClick={onClose} className={styles.style9}><X size={16} /></button>
        </div>
        <div className={styles.style10}>
          <div>
            <FieldLabel required>Invoice</FieldLabel>
            <select value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
              className={styles.style11}>
              <option value="">Select invoice…</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.invoiceNumber} — ₹{(inv.visitCharges + inv.additionalCharges - inv.discount).toLocaleString('en-IN')}</option>
              ))}
            </select>
          </div>
          <div className={styles.style12}>
            <div>
              <FieldLabel required>Insurer Name</FieldLabel>
              <input value={insurerName} onChange={e => setInsurerName(e.target.value)}
                placeholder="e.g. Star Health"
                className={styles.style13} />
            </div>
            <div>
              <FieldLabel required>Policy Number</FieldLabel>
              <input value={policyNumber} onChange={e => setPolicyNumber(e.target.value)}
                placeholder="e.g. SH-2024-001234"
                className={styles.style13} />
            </div>
          </div>
          <div className={styles.style12}>
            <div>
              <FieldLabel required>Claim Number</FieldLabel>
              <input value={claimNumber} onChange={e => setClaimNumber(e.target.value)}
                placeholder="e.g. CLM-SH-20240310-0042"
                className={styles.style13} />
            </div>
            <div>
              <FieldLabel required>Submitted Date</FieldLabel>
              <input type="date" value={submittedDate} onChange={e => setSubmittedDate(e.target.value)}
                className={styles.style11} />
            </div>
          </div>
          <div className={styles.style12}>
            <div>
              <FieldLabel required>Claimed Amount (₹)</FieldLabel>
              <input type="number" min={0} value={claimedAmount} onChange={e => setClaimedAmount(e.target.value)}
                className={styles.style11} />
            </div>
            <div>
              <FieldLabel>Approved Amount (₹)</FieldLabel>
              <input type="number" min={0} value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)}
                className={styles.style11} />
            </div>
          </div>
          <div className={styles.style12}>
            <div>
              <FieldLabel required>Claim Status</FieldLabel>
              <select value={status} onChange={e => setStatus(e.target.value as ClaimStatus)}
                className={styles.style11}>
                {CLAIM_STATUS_OPTIONS.map(s => <option key={s} value={s}>{CLAIM_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Settlement Date</FieldLabel>
              <input type="date" value={settledDate} onChange={e => setSettledDate(e.target.value)}
                className={styles.style11} />
            </div>
          </div>
          <div>
            <FieldLabel>Remarks</FieldLabel>
            <textarea rows={2} value={remarks} onChange={e => setRemarks(e.target.value)}
              placeholder="Notes on approval, rejection reason, etc."
              className={styles.style14} />
          </div>
        </div>
        <div className={styles.style15}>
          <button onClick={onClose} className={styles.style16}>Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className={styles.style17}>
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
      <div className={styles.style18}>
        {/* KPI strip */}
        <div className={styles.style19}>
          {[
            { label: 'Total Claimed',  value: fmtCurrency(totalClaimed),  color: 'text-foreground'  },
            { label: 'Total Approved', value: fmtCurrency(totalApproved), color: 'text-success-emphasis-mid'   },
            { label: 'Pending Claims', value: String(pending),            color: pending > 0 ? 'text-warning-emphasis-mid' : 'text-muted-foreground' },
          ].map(s => (
            <div key={s.label} className={styles.style20}>
              <p className={styles.style21}>{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className={styles.style22}>
          <button onClick={() => setAddOpen(true)}
            className={styles.style23}>
            <Plus size={15} /> File Claim
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className={styles.style24}>
            <ShieldCheck size={32} className={styles.style25} />
            <p className={styles.style26}>No insurance claims on record</p>
            <p className={styles.style27}>Filed claims will appear here.</p>
          </div>
        ) : (
          <div className={styles.style28}>
            {sorted.map(claim => (
              <div key={claim.id} className={styles.style29}>
                <div className={styles.style30}>
                  <div>
                    <p className={styles.style31}>{claim.insurerName}</p>
                    <p className={styles.style32}>Policy: {claim.policyNumber} · Claim: {claim.claimNumber}</p>
                  </div>
                  <span className={styles.style1Class(CLAIM_STATUS_COLORS[claim.status])}>
                    {CLAIM_STATUS_LABELS[claim.status]}
                  </span>
                </div>
                <div className={styles.style33}>
                  <div>
                    <p className={styles.style34}>Claimed</p>
                    <p className={styles.style35}>{fmtCurrency(claim.claimedAmount)}</p>
                  </div>
                  <div>
                    <p className={styles.style34}>Approved</p>
                    <p className={styles.style2Class(claim.approvedAmount !== undefined ? 'text-success-emphasis-mid' : 'text-muted-foreground')}>
                      {claim.approvedAmount !== undefined ? fmtCurrency(claim.approvedAmount) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className={styles.style34}>Submitted</p>
                    <p className={styles.style36}>{fmtDate(claim.submittedDate)}</p>
                  </div>
                </div>
                {claim.remarks && (
                  <div className={styles.style37}>
                    <p className={styles.style38}>{claim.remarks}</p>
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
