import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Appointment } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import type { Doctor } from '../../datapoints/scheduling';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Textarea } from '../../components/controls/Textarea';
import { Callout } from '../../components/feedback/Callout';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';

interface Props {
  appointment: Appointment;
  patient: Patient;
  doctor: Doctor;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export function CancelOverlay({ appointment, patient, doctor, onConfirm, onClose }: Props) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  function handleConfirm() {
    if (!reason.trim()) {
      setError('Cancellation reason is required');
      return;
    }
    onConfirm(reason.trim());
  }

  return (
    <Modal onClose={onClose} overlayClassName="bg-black/50">
      <ModalHeader title="Cancel Appointment" onClose={onClose} />

      <ModalBody scroll={false} className="space-y-4">
        <Callout
          variant="warning"
          icon={<AlertTriangle size={18} />}
          title="You are about to cancel:"
          subtitle={`${APPOINTMENT_TYPE_LABELS[appointment.type]} · ${doctor.name}`}
        >
          {patient.name} · {appointment.time}
        </Callout>

        <FormField label="Reason for Cancellation" required error={error}>
          <Textarea
            rows={3}
            placeholder="Enter reason for cancellation..."
            value={reason}
            error={!!error}
            onChange={(e) => { setReason(e.target.value); setError(''); }}
          />
        </FormField>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>Back</Button>
        <Button variant="destructive" size="sm" onClick={handleConfirm}>
          Confirm Cancellation
        </Button>
      </ModalFooter>
    </Modal>
  );
}
