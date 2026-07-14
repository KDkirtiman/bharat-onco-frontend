import * as styles from './ViewInvoiceOverlay.styles';
import { X, Printer, Download } from 'bfd-icons';
import type { Appointment } from 'bfd-core';
import type { Doctor } from 'bfd-core';
import type { Invoice } from 'bfd-core';
import type { Patient } from 'bfd-core';
import { generateInvoiceHTML, printInvoice, downloadInvoice } from '../../../lib/invoiceTemplate';
import { Modal } from 'bfd-core';
import { IconButton } from 'bfd-core';

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
    <Modal onClose={onClose} className={styles.style1} closeOnEscape={false}>

        {/* Header */}
        <div className={styles.style2}>
          <div>
            <p className={styles.style3}>{invoice.invoiceNumber}</p>
            <p className={styles.style4}>{patient.name} · {appointment.center}</p>
          </div>
          <div className={styles.style5}>
            <button
              onClick={() => printInvoice(params)}
              className={styles.style6}
            >
              <Printer size={15} />
              Print
            </button>
            <button
              onClick={() => downloadInvoice(params)}
              className={styles.style7}
            >
              <Download size={15} />
              Save as PDF
            </button>
            <IconButton
              icon={<X size={18} />}
              label="Close"
              onClick={onClose}
              className={styles.style8}
            />
          </div>
        </div>

        {/* Invoice preview */}
        <iframe
          srcDoc={generateInvoiceHTML(params)}
          className={styles.style9}
          title={`Invoice ${invoice.invoiceNumber}`}
          style={{ border: 'none' }}
        />

    </Modal>
  );
}
