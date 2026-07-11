import * as styles from './ViewDetailsOverlay.styles';
import type { Appointment } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, getPrimaryActionLabel } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { Doctor } from 'bfd-core';
import { Button } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { StatusBadge } from 'bfd-core';

interface Props {
  appointment:     Appointment;
  patient:         Patient;
  doctor:          Doctor;
  onClose:         () => void;
  onPrimaryAction?: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.style1}>
      <span className={styles.style2}>{label}</span>
      <span className={styles.style3}>{children}</span>
    </div>
  );
}

export function ViewDetailsOverlay({ appointment, patient, doctor, onClose, onPrimaryAction }: Props) {
  const primaryActionLabel = getPrimaryActionLabel(appointment.type, appointment.status);
  return (
    <Modal onClose={onClose} overlayClassName="bg-black/50">
      <ModalHeader title="Appointment Details" onClose={onClose} />

      <ModalBody scroll={false} className={styles.style4}>
        <Row label="Patient Name">{patient.name}</Row>
        <Row label="MRN">{patient.mrn}</Row>
        <Row label="Date">{formatDate(appointment.date)}</Row>
        <Row label="Time">{appointment.time}</Row>
        <Row label="Visit Type">{APPOINTMENT_TYPE_LABELS[appointment.type]}</Row>
        <Row label="Doctor">{doctor.name}</Row>
        <Row label="Center">{appointment.center}</Row>
        <Row label="Status">
          <StatusBadge status={appointment.status} />
        </Row>
        {appointment.cancellationReason && (
          <Row label="Cancellation Reason">{appointment.cancellationReason}</Row>
        )}
      </ModalBody>

      <ModalFooter className={styles.style5}>
        <Button variant="ghost" size="sm" className={styles.style6} onClick={onClose}>
          Close
        </Button>
        {primaryActionLabel && onPrimaryAction && (
          <Button size="sm" className={styles.style7} onClick={() => { onPrimaryAction(); onClose(); }}>
            {primaryActionLabel}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
