import * as styles from './CancelOverlay.styles';
import { useState } from 'react';
import { AlertTriangle } from 'bfd-icons';
import type { Appointment } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { Doctor } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { Callout } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';

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

      <ModalBody scroll={false} className={styles.style1}>
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
