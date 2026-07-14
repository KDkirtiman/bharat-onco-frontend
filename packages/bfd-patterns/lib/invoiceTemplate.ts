import type { Appointment, Doctor } from 'bfd-core';
import {
  APPOINTMENT_TYPE_LABELS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
} from 'bfd-core';
import type { Invoice } from 'bfd-core';
import type { Patient } from 'bfd-core';
import { PRINT_NEUTRAL_HEX as gray, PRINT_BRAND_HEX as brand } from 'bfd-themes';

/** Shared CSS for print/PDF documents (invoice + registration receipt). */
function documentStyles(): string {
  return `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: ${gray.slateSoft};
    color: ${gray.slateBody};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    max-width: 760px;
    margin: 24px auto;
    background: ${gray.white};
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  }

  /* ── Header ── */
  .hdr {
    background: linear-gradient(135deg, ${brand.violetDark} 0%, ${brand.violetMid} 60%, ${brand.violetLight} 100%);
    color: ${gray.white};
    padding: 32px 40px 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .org-name  { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
  .org-sub   { font-size: 11px; color: rgba(255,255,255,0.75); margin-top: 3px; letter-spacing: 0.3px; }
  .inv-right { text-align: right; }
  .inv-title { font-size: 26px; font-weight: 200; letter-spacing: 6px; text-transform: uppercase; }
  .inv-num   { font-size: 12px; font-family: 'Courier New', monospace; color: rgba(255,255,255,0.8); margin-top: 6px; }

  /* ── Body ── */
  .body { padding: 32px 40px; }

  /* ── Info grid ── */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px 32px;
    margin-bottom: 28px;
  }
  .info-block h4 {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    color: ${brand.violetMid};
    font-weight: 700;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid ${brand.violetSoft};
  }
  .info-block .primary { font-size: 14px; font-weight: 600; color: ${gray.gray900}; margin-bottom: 2px; }
  .info-block p { font-size: 12px; color: ${gray.gray600}; line-height: 1.7; }
  .info-block strong { color: ${gray.gray700}; }
  .mono { font-family: 'Courier New', monospace; }

  /* ── Divider ── */
  hr { border: none; border-top: 1px solid ${gray.gray200}; margin: 4px 0 24px; }

  /* ── Table ── */
  .table-wrap { border: 1px solid ${gray.gray200}; border-radius: 8px; overflow: hidden; margin-bottom: 0; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: ${brand.violetSoft}; }
  thead th {
    padding: 10px 16px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: ${brand.violetDark};
    font-weight: 700;
    text-align: left;
  }
  thead th.amt { text-align: right; }
  tbody tr { border-top: 1px solid ${gray.gray100}; }
  tbody td { padding: 12px 16px; font-size: 13px; color: ${gray.gray700}; }
  tbody td.amt { text-align: right; font-weight: 600; color: ${gray.gray900}; }
  .discount-row td { color: ${brand.successEmphasisMid} !important; }

  /* ── Total bar ── */
  .total-bar {
    background: linear-gradient(90deg, ${brand.violetDark}, ${brand.violetMid});
    color: ${gray.white};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    font-size: 15px;
    font-weight: 700;
    border-radius: 0 0 8px 8px;
    margin-top: 0;
  }

  /* ── Payment section ── */
  .payment { margin-top: 24px; display: flex; gap: 32px; }
  .payment-block h4, .payment h4 {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    color: ${brand.violetMid};
    font-weight: 700;
    margin-bottom: 8px;
  }
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }
  .badge-type    { background: ${brand.violetSoft}; color: ${brand.violetDark}; }
  .badge-paid    { background: ${brand.successSoft}; color: ${brand.successEmphasis}; }
  .badge-pending { background: ${brand.warningSoft}; color: ${brand.warningEmphasis}; }
  .badge-preauth { background: ${brand.infoSoft}; color: ${brand.infoEmphasis}; }
  .badge-waived  { background: ${brand.neutralSoft}; color: ${brand.neutralEmphasis}; }

  /* ── Footer ── */
  .footer {
    margin-top: 36px;
    padding: 20px 40px;
    background: ${gray.gray50};
    border-top: 1px solid ${gray.gray200};
    text-align: center;
  }
  .footer .tagline { font-size: 13px; font-weight: 600; color: ${brand.violetMid}; margin-bottom: 6px; }
  .footer p { font-size: 11px; color: ${gray.gray400}; line-height: 1.7; }

  /* ── Print ── */
  @media print {
    body { background: ${gray.white}; }
    .page { margin: 0; border-radius: 0; box-shadow: none; max-width: 100%; }
  }
  `;
}

export interface InvoiceParams {
  invoice:     Invoice;
  appointment: Appointment;
  patient:     Patient;
  doctor:      Doctor;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function inr(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const STATUS_BADGE: Record<string, string> = {
  paid:     'badge-paid',
  pending:  'badge-pending',
  'pre-auth':'badge-preauth',
  waived:   'badge-waived',
};

export function generateInvoiceHTML({ invoice, appointment, patient, doctor }: InvoiceParams): string {
  const total = Math.max(0, invoice.visitCharges + invoice.additionalCharges - invoice.discount);

  const additionalRow = invoice.additionalCharges > 0
    ? `<tr><td>Additional Charges</td><td class="amt">${inr(invoice.additionalCharges)}</td></tr>`
    : '';

  const discountRow = invoice.discount > 0
    ? `<tr class="discount-row"><td>Discount</td><td class="amt">− ${inr(invoice.discount)}</td></tr>`
    : '';

  const statusBadge = STATUS_BADGE[invoice.paymentStatus] ?? 'badge-waived';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Invoice ${invoice.invoiceNumber}</title>
<style>${documentStyles()}</style>
</head>
<body>
<div class="page">

  <div class="hdr">
    <div>
      <div class="org-name">BHARAT ONCOLOGY</div>
      <div class="org-sub">Advanced Cancer Care Centers · ${appointment.center}</div>
    </div>
    <div class="inv-right">
      <div class="inv-title">Invoice</div>
      <div class="inv-num">${invoice.invoiceNumber}</div>
    </div>
  </div>

  <div class="body">

    <div class="info-grid">
      <div class="info-block">
        <h4>Bill To</h4>
        <p class="primary">${patient.name}</p>
        <p>MRN: ${patient.mrn}</p>
        <p>Contact: ${patient.phone}</p>
      </div>
      <div class="info-block">
        <h4>Invoice Details</h4>
        <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Visit ID:</strong> ${invoice.visitId}</p>
        <p><strong>Date:</strong> ${fmtDate(invoice.createdAt)}</p>
      </div>
      <div class="info-block">
        <h4>Service Provider</h4>
        <p class="primary">${doctor.name}</p>
        <p>${doctor.specialization}</p>
        <p>Bharat Oncology – ${appointment.center}</p>
      </div>
      <div class="info-block">
        <h4>Visit Information</h4>
        <p><strong>Type:</strong> ${APPOINTMENT_TYPE_LABELS[invoice.visitType]}</p>
        <p><strong>Date:</strong> ${fmtDate(appointment.date)}</p>
        <p><strong>Time:</strong> ${fmtTime(appointment.time)}</p>
      </div>
    </div>

    <hr />

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="amt">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${APPOINTMENT_TYPE_LABELS[invoice.visitType]} — Consultation / Treatment Charges</td>
            <td class="amt">${inr(invoice.visitCharges)}</td>
          </tr>
          ${additionalRow}
          ${discountRow}
        </tbody>
      </table>
      <div class="total-bar">
        <span>Total Amount</span>
        <span>${inr(total)}</span>
      </div>
    </div>

    <div class="payment">
      <div class="payment-block">
        <h4>Payment Method</h4>
        <span class="badge badge-type">${PAYMENT_TYPE_LABELS[invoice.paymentType]}</span>
      </div>
      <div class="payment-block">
        <h4>Payment Status</h4>
        <span class="badge ${statusBadge}">${PAYMENT_STATUS_LABELS[invoice.paymentStatus]}</span>
      </div>
    </div>

  </div>

  <div class="footer">
    <p class="tagline">Thank you for choosing Bharat Oncology</p>
    <p>Bharat Oncology Advanced Cancer Care Centers · ${appointment.center}</p>
    <p>For billing queries: billing@bharatoncology.in &nbsp;|&nbsp; Helpline: 1800-XXX-XXXX</p>
    <p style="margin-top:8px;font-size:10px;color:${gray.gray300};">
      This is a computer-generated invoice and does not require a physical signature.
    </p>
  </div>

</div>
</body>
</html>`;
}

const REGISTRATION_FEE = 500;

export function generateRegistrationReceiptHTML(
  patient: Patient,
  center:  string,
  receiptNumber: string,
): string {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const dobFmt = patient.dob
    ? new Date(patient.dob + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';
  const genderLabel = patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Registration Receipt ${receiptNumber}</title>
<style>${documentStyles()}</style>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div>
      <div class="org-name">BHARAT ONCOLOGY</div>
      <div class="org-sub">Advanced Cancer Care Centers · ${center}</div>
    </div>
    <div class="inv-right">
      <div class="inv-title">Registration Receipt</div>
      <div class="inv-num">${receiptNumber}</div>
    </div>
  </div>
  <div class="body">
    <div class="info-grid">
      <div class="info-block">
        <h4>Patient Details</h4>
        <p class="primary">${patient.name}</p>
        <p>MRN: <strong class="mono">${patient.mrn}</strong></p>
        <p>Contact: ${patient.phone}</p>
        ${dobFmt ? `<p>Date of Birth: ${dobFmt}</p>` : ''}
        <p>Gender: ${genderLabel}</p>
      </div>
      <div class="info-block">
        <h4>Registration Details</h4>
        <p><strong>Receipt #:</strong> <span class="mono">${receiptNumber}</span></p>
        <p><strong>Center:</strong> ${center}</p>
        <p><strong>Date:</strong> ${today}</p>
      </div>
    </div>
    <hr />
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="amt">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Patient Registration Fee</td>
            <td class="amt">₹${REGISTRATION_FEE.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      <div class="total-bar">
        <span>Total Amount</span>
        <span>₹${REGISTRATION_FEE.toLocaleString('en-IN')}</span>
      </div>
    </div>
    <div class="payment">
      <h4>Payment Status</h4>
      <span class="badge badge-paid">Paid</span>
    </div>
  </div>
  <div class="footer">
    <p class="tagline">Welcome to Bharat Oncology</p>
    <p>Bharat Oncology Advanced Cancer Care Centers · ${center}</p>
    <p>For queries: info@bharatoncology.in &nbsp;|&nbsp; Helpline: 1800-XXX-XXXX</p>
    <p style="margin-top:8px;font-size:10px;color:${gray.gray300};">
      This is a computer-generated receipt and does not require a physical signature.
    </p>
  </div>
</div>
</body>
</html>`;
}

export function printRegistrationReceipt(patient: Patient, center: string, receiptNumber: string): void {
  const html = generateRegistrationReceiptHTML(patient, center, receiptNumber);
  const win = window.open('', '_blank', 'width=860,height=960,scrollbars=yes');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 400);
}

export function printInvoice(params: InvoiceParams): void {
  const html = generateInvoiceHTML(params);
  const win = window.open('', '_blank', 'width=860,height=960,scrollbars=yes');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 400);
}

export function downloadInvoice(params: InvoiceParams): void {
  printInvoice(params);
}
