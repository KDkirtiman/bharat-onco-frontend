import { useState } from 'react';
import { Receipt } from 'lucide-react';
import type { Invoice } from '../../datapoints/billing';
import type { PaymentStatus, Appointment, Doctor } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS, mockDoctors } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import { ViewInvoiceOverlay } from '../../patterns/billing/ViewInvoiceOverlay';

interface Props {
  invoices:      Invoice[];
  patient?:      Patient;
  appointments?: Appointment[];
  doctors?:      Doctor[];
}

const STATUS_COLORS: Record<PaymentStatus, string> = {
  paid:      'bg-green-100 text-green-700',
  pending:   'bg-amber-100 text-amber-700',
  'pre-auth':'bg-blue-100 text-blue-700',
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Receipt size={36} className="text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No invoices on record</p>
        <p className="text-xs text-muted-foreground mt-1">Billing history will appear here after visits are invoiced.</p>
      </div>
    );
  }

  return (
    <>
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Billed', value: fmtCurrency(total),       color: 'text-foreground'  },
          { label: 'Paid',         value: fmtCurrency(paid),         color: 'text-green-600'   },
          { label: 'Outstanding',  value: fmtCurrency(outstanding),  color: outstanding > 0 ? 'text-destructive' : 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoice #</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Visit Type</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
              <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(inv => {
              const amount = inv.visitCharges + inv.additionalCharges - inv.discount;
              return (
                <tr key={inv.id} onClick={() => setViewInvoiceId(inv.id)}
                  className="border-t border-border hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="py-3 px-4 text-sm font-mono text-primary">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{APPOINTMENT_TYPE_LABELS[inv.visitType]}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground text-right">{fmtCurrency(amount)}</td>
                  <td className="py-3 px-4">
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
