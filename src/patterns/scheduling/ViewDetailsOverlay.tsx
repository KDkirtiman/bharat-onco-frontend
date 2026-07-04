import type { Appointment } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS, getPrimaryActionLabel } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import type { Doctor } from '../../datapoints/scheduling';
import { Button } from '../../components/controls/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';
import { StatusBadge } from '../../components/feedback/StatusBadge';

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
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{children}</span>
    </div>
  );
}

export function ViewDetailsOverlay({ appointment, patient, doctor, onClose, onPrimaryAction }: Props) {
  const primaryActionLabel = getPrimaryActionLabel(appointment.type, appointment.status);
  return (
    <Modal onClose={onClose} overlayClassName="bg-black/50">
      <ModalHeader title="Appointment Details" onClose={onClose} />

      <ModalBody scroll={false} className="py-2">
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

      <ModalFooter className="justify-between">
        <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80 px-4" onClick={onClose}>
          Close
        </Button>
        {primaryActionLabel && onPrimaryAction && (
          <Button size="sm" className="px-4 font-semibold" onClick={() => { onPrimaryAction(); onClose(); }}>
            {primaryActionLabel}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
