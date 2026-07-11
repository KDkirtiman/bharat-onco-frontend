import * as styles from './PastInvoicesSubTab.styles';
import { useState } from 'react';
import { Receipt } from 'bfd-icons';
import type { Invoice } from 'bfd-core';
import type { PaymentStatus, Appointment, Doctor } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, mockDoctors } from 'bfd-core';
import type { Patient } from 'bfd-core';
import { ViewInvoiceOverlay } from '../../patterns/billing/ViewInvoiceOverlay';

interface Props {
  invoices:      Invoice[];
  patient?:      Patient;
  appointments?: Appointment[];
  doctors?:      Doctor[];
}

const STATUS_COLORS: Record<PaymentStatus, string> = {
  paid:      'bg-success-soft text-success-emphasis',
  pending:   'bg-warning-soft text-warning-emphasis',
  'pre-auth':'bg-info-soft text-info-emphasis',
  waived:    'bg-muted text-muted-foreground',
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  paid:      'Paid',
  pending:   'Pending',
  'pre-auth':'Pre-Auth',
  waived:    'Waived',
};

function fmtCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function PastInvoicesSubTab({ invoices, patient, appointments = [], doctors = mockDoctors }: Props) {
  const [viewInvoiceId, setViewInvoiceId] = useState<string | null>(null);
  const sorted = [...invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const viewInvoice = viewInvoiceId ? invoices.find(i => i.id === viewInvoiceId) : null;

  const total       = invoices.reduce((s, i) => s + i.visitCharges + i.additionalCharges - i.discount, 0);
  const paid        = invoices.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.visitCharges + i.additionalCharges - i.discount, 0);
  const outstanding = total - paid;

  if (invoices.length === 0) {
    return (
      <div className={styles.style1}>
        <Receipt size={36} className={styles.style2} />
        <p className={styles.style3}>No invoices on record</p>
        <p className={styles.style4}>Billing history will appear here after visits are invoiced.</p>
      </div>
    );
  }

  return (
    <>
      {/* Summary strip */}
      <div className={styles.style5}>
        {[
          { label: 'Total Billed', value: fmtCurrency(total),       color: 'text-foreground'  },
          { label: 'Paid',         value: fmtCurrency(paid),         color: 'text-success-emphasis-mid'   },
          { label: 'Outstanding',  value: fmtCurrency(outstanding),  color: outstanding > 0 ? 'text-destructive' : 'text-success-emphasis-mid' },
        ].map(s => (
          <div key={s.label} className={styles.style6}>
            <p className={styles.style7}>{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <div className={styles.style8}>
        <table className={styles.style9}>
          <thead>
            <tr className={styles.style10}>
              <th className={styles.style11}>Invoice #</th>
              <th className={styles.style11}>Visit Type</th>
              <th className={styles.style11}>Date</th>
              <th className={styles.style12}>Amount</th>
              <th className={styles.style11}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(inv => {
              const amount = inv.visitCharges + inv.additionalCharges - inv.discount;
              return (
                <tr key={inv.id} onClick={() => setViewInvoiceId(inv.id)}
                  className={styles.style13}>
                  <td className={styles.style14}>{inv.invoiceNumber}</td>
                  <td className={styles.style15}>{APPOINTMENT_TYPE_LABELS[inv.visitType]}</td>
                  <td className={styles.style16}>
                    {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={styles.style17}>{fmtCurrency(amount)}</td>
                  <td className={styles.style18}>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[inv.paymentStatus]}`}>
                      {STATUS_LABELS[inv.paymentStatus]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewInvoice && (
        <ViewInvoiceOverlay
          invoice={viewInvoice}
          appointment={appointments.find(a => a.id === viewInvoice.appointmentId) ?? {
            id: viewInvoice.appointmentId,
            visitId: viewInvoice.visitId,
            patientId: viewInvoice.patientId,
            doctorId: doctors[0]?.id ?? 'd1',
            date: viewInvoice.createdAt,
            time: '09:00',
            type: viewInvoice.visitType,
            status: 'completed',
            center: viewInvoice.center,
          }}
          patient={patient ?? { id: viewInvoice.patientId, mrn: '', name: 'Patient', dob: '1970-01-01', gender: 'M', phone: '', registeredDate: viewInvoice.createdAt, center: viewInvoice.center }}
          doctor={doctors.find(d => appointments.some(a => a.id === viewInvoice.appointmentId && a.doctorId === d.id)) ?? doctors[0] ?? { id: 'd1', name: 'Doctor', specialization: 'Oncology' }}
          onClose={() => setViewInvoiceId(null)}
        />
      )}
    </>
  );
}
