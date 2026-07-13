import * as styles from './ChairAssignmentOverlay.styles';
import { useState } from 'react';
import { Armchair, CheckCircle2 } from 'bfd-icons';

import type { Appointment } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { Chair } from 'bfd-core';
import { Button } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { cn } from 'bfd-core';

interface Props {
  appointment:    Appointment;
  patient:        Patient;
  selectedCenter: string;
  chairs:         Chair[];
  onAssign:       (chairId: string) => void;
  onClose:        () => void;
}

export function ChairAssignmentOverlay({ appointment, patient, selectedCenter, chairs, onAssign, onClose }: Props) {
  const centerChairs   = chairs.filter(c => c.center === selectedCenter);
  const availableCount = centerChairs.filter(c => c.status === 'available').length;
  const bays           = [...new Set(centerChairs.map(c => c.bay))];

  const [selected, setSelected] = useState<string | null>(appointment.chairId ?? null);

  return (
    <Modal
      onClose={onClose}
      size="lg"
      overlayClassName="bg-black/40 backdrop-blur-sm"
      className={styles.style3}
    >
      <ModalHeader
        title="Assign Infusion Chair"
        icon={<Armchair size={18} className={styles.style4} />}
        onClose={onClose}
      />

      {/* Patient strip */}
      <div className={styles.style5}>
        <p className={styles.style6}>{patient.name}</p>
        <p className={styles.style7}>{patient.mrn} · {appointment.visitId}</p>
      </div>

      {/* Chair grid grouped by bay */}
      <ModalBody className={styles.style8}>
        {centerChairs.length === 0 ? (
          <div className={styles.style9}>
            <Armchair size={32} className={styles.style10} />
            <p className={styles.style11}>No chairs configured for {selectedCenter}</p>
          </div>
        ) : (
          bays.map(bay => (
            <div key={bay}>
              <p className={styles.style12}>{bay}</p>
              <div className={styles.style13}>
                {centerChairs.filter(c => c.bay === bay).map(chair => {
                  const isAvailable = chair.status === 'available';
                  const isSelected  = selected === chair.id;
                  return (
                    <button
                      key={chair.id}
                      disabled={!isAvailable}
                      onClick={() => setSelected(chair.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                        isSelected
                          ? 'border-indigo-emphasis-mid bg-indigo-soft text-indigo-emphasis'
                          : isAvailable
                          ? 'border-border bg-card hover:border-indigo-border hover:bg-indigo-soft/50 text-foreground'
                          : 'border-border cursor-not-allowed opacity-40',
                        chair.status === 'occupied'     && 'bg-warning-surface-soft',
                        chair.status === 'maintenance'  && 'bg-muted/30',
                      )}
                    >
                      <Armchair size={18} />
                      <span className={styles.style14}>{chair.name}</span>
                      <span className={cn(
                        'text-caption font-medium px-1.5 py-0.5 rounded-full leading-tight',
                        chair.status === 'available'   ? 'bg-success-soft text-success-emphasis'   :
                        chair.status === 'occupied'    ? 'bg-warning-soft text-warning-emphasis'   :
                                                        'bg-neutral-soft text-neutral-emphasis',
                      )}>
                        {chair.status === 'available'   ? 'Free'        :
                         chair.status === 'occupied'    ? 'Occupied'    :
                                                         'Maint.'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </ModalBody>

      <ModalFooter className={styles.style15}>
        <p className={styles.style7}>
          {availableCount} of {centerChairs.length} chairs available
        </p>
        <div className={styles.style16}>
          <Button variant="ghost" size="sm" className={styles.style17} onClick={onClose}>
            Cancel
          </Button>
          <button
            onClick={() => selected && onAssign(selected)}
            disabled={!selected}
            className={styles.style18}
          >
            <CheckCircle2 size={14} />
            Assign Chair
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
