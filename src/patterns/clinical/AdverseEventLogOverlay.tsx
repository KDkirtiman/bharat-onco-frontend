import { useState } from 'react';
import { AlertTriangle, Plus, Clock } from 'lucide-react';
import type { Appointment } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import type { AdverseEvent } from '../../datapoints/clinical';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Select } from '../../components/controls/Select';
import { TextField } from '../../components/controls/TextField';
import { Textarea } from '../../components/controls/Textarea';

interface Props {
  appointment: Appointment;
  patient:     Patient;
  events:      AdverseEvent[];
  onAddEvent:  (event: AdverseEvent) => void;
  onClose:     () => void;
}

const SEVERITY_CONFIG: Record<AdverseEvent['severity'], { label: string; className: string }> = {
  mild:     { label: 'Mild',     className: 'bg-amber-100 text-amber-700'         },
  moderate: { label: 'Moderate', className: 'bg-orange-100 text-orange-700'       },
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
    <Modal onClose={onClose} size="xl" className="max-h-[85vh] shadow-xl" overlayClassName="bg-black/40 backdrop-blur-sm">
      <ModalHeader
        title="Adverse Event Log"
        icon={<AlertTriangle size={18} className="text-amber-500" />}
        onClose={onClose}
      />

      {/* Patient strip */}
      <div className="px-6 py-3 bg-muted/30 border-b border-border shrink-0">
        <p className="text-sm font-medium text-foreground">{patient.name}</p>
        <p className="text-xs text-muted-foreground">{appointment.visitId} · Chemo Session</p>
      </div>

      {/* Scrollable body */}
      <ModalBody className="py-4 space-y-4">

          {/* Existing events */}
          {events.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <AlertTriangle size={28} className="opacity-30 mx-auto mb-2" />
              <p className="text-sm">No adverse events logged for this session</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map(ev => {
                const cfg = SEVERITY_CONFIG[ev.severity];
                return (
                  <div key={ev.id} className="flex gap-3 p-3 rounded-xl border border-border bg-muted/20">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 pt-0.5">
                      <Clock size={11} />
                      {ev.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.className}`}>
                        {cfg.label}
                      </span>
                      <p className="text-sm text-foreground mt-1">{ev.description}</p>
                      {ev.actionTaken && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="font-medium">Action:</span> {ev.actionTaken}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add form */}
          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Log New Event</p>

            <div className="grid grid-cols-2 gap-3">
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
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} />
              Log Event
            </button>
          </div>
      </ModalBody>

      {/* Footer */}
      <ModalFooter>
        <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
