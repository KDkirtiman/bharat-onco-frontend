import { X, Printer, Download } from 'lucide-react';
import type { Appointment } from '../../datapoints/scheduling';
import type { Doctor } from '../../datapoints/scheduling';
import type { Invoice } from '../../datapoints/billing';
import type { Patient } from '../../datapoints/patients';
import { generateInvoiceHTML, printInvoice, downloadInvoice } from '../../lib/invoiceTemplate';
import { Modal } from '../../components/layout/Modal';
import { IconButton } from '../../components/controls/IconButton';

interface Props {
  invoice:     Invoice;
  appointment: Appointment;
  patient:     Patient;
  doctor:      Doctor;
  onClose:     () => void;
}

export function ViewInvoiceOverlay({ invoice, appointment, patient, doctor, onClose }: Props) {
  const params = { invoice, appointment, patient, doctor };

  return (
    <Modal onClose={onClose} className="max-w-4xl h-[90vh]" closeOnEscape={false}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <p className="text-base font-semibold text-foreground font-mono">{invoice.invoiceNumber}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{patient.name} · {appointment.center}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => printInvoice(params)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted text-foreground transition-colors"
            >
              <Printer size={15} />
              Print
            </button>
            <button
              onClick={() => downloadInvoice(params)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download size={15} />
              Save as PDF
            </button>
            <IconButton
              icon={<X size={18} />}
              label="Close"
              onClick={onClose}
              className="ml-1"
            />
          </div>
        </div>

        {/* Invoice preview */}
        <iframe
          srcDoc={generateInvoiceHTML(params)}
          className="flex-1 w-full rounded-b-2xl"
          title={`Invoice ${invoice.invoiceNumber}`}
          style={{ border: 'none' }}
        />

    </Modal>
  );
}
