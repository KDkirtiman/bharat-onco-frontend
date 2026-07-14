import * as styles from './AdverseEventLogOverlay.styles';
import { useState } from 'react';
import { AlertTriangle, Plus, Clock } from 'bfd-icons';
import type { Appointment } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { AdverseEvent } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';

interface Props {
  appointment: Appointment;
  patient:     Patient;
  events:      AdverseEvent[];
  onAddEvent:  (event: AdverseEvent) => void;
  onClose:     () => void;
}

const SEVERITY_CONFIG: Record<AdverseEvent['severity'], { label: string; className: string }> = {
  mild:     { label: 'Mild',     className: 'bg-warning-soft text-warning-emphasis'         },
  moderate: { label: 'Moderate', className: 'bg-orange-soft text-orange-emphasis'       },
  severe:   { label: 'Severe',   className: 'bg-destructive/10 text-destructive'  },
};

export function AdverseEventLogOverlay({ appointment, patient, events, onAddEvent, onClose }: Props) {
  const nowTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const [time,        setTime]        = useState(nowTime);
  const [severity,    setSeverity]    = useState<AdverseEvent['severity']>('mild');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  function handleAdd() {
    if (!description.trim()) return;
    onAddEvent({
      id:            `ae-${Date.now()}`,
      patientId:     patient.id,
      appointmentId: appointment.id,
      time,
      description:   description.trim(),
      severity,
      actionTaken:   actionTaken.trim(),
    });
    setDescription('');
    setActionTaken('');
    setTime(nowTime());
    setSeverity('mild');
  }

  return (
    <Modal onClose={onClose} size="xl" className={styles.style1} overlayClassName="bg-black/40 backdrop-blur-sm">
      <ModalHeader
        title="Adverse Event Log"
        icon={<AlertTriangle size={18} className={styles.style2} />}
        onClose={onClose}
      />

      {/* Patient strip */}
      <div className={styles.style3}>
        <p className={styles.style4}>{patient.name}</p>
        <p className={styles.style5}>{appointment.visitId} · Chemo Session</p>
      </div>

      {/* Scrollable body */}
      <ModalBody className={styles.style6}>

          {/* Existing events */}
          {events.length === 0 ? (
            <div className={styles.style7}>
              <AlertTriangle size={28} className={styles.style8} />
              <p className={styles.style9}>No adverse events logged for this session</p>
            </div>
          ) : (
            <div className={styles.style10}>
              {events.map(ev => {
                const cfg = SEVERITY_CONFIG[ev.severity];
                return (
                  <div key={ev.id} className={styles.style11}>
                    <div className={styles.style12}>
                      <Clock size={11} />
                      {ev.time}
                    </div>
                    <div className={styles.style13}>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.className}`}>
                        {cfg.label}
                      </span>
                      <p className={styles.style14}>{ev.description}</p>
                      {ev.actionTaken && (
                        <p className={styles.style15}>
                          <span className={styles.style16}>Action:</span> {ev.actionTaken}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add form */}
          <div className={styles.style17}>
            <p className={styles.style18}>Log New Event</p>

            <div className={styles.style19}>
              <FormField label="Time">
                <TextField
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </FormField>
              <FormField label="Severity">
                <Select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as AdverseEvent['severity'])}
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Description" required>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the event (e.g. nausea, hypotension, rash)…"
                rows={2}
              />
            </FormField>

            <FormField label="Action Taken">
              <TextField
                type="text"
                value={actionTaken}
                onChange={e => setActionTaken(e.target.value)}
                placeholder="e.g. Ondansetron 8mg IV, infusion rate reduced"
              />
            </FormField>

            <button
              onClick={handleAdd}
              disabled={!description.trim()}
              className={styles.style20}
            >
              <Plus size={14} />
              Log Event
            </button>
          </div>
      </ModalBody>

      {/* Footer */}
      <ModalFooter>
        <Button variant="ghost" size="sm" className={styles.style21} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
