import { X } from 'lucide-react';
import type { Appointment, AppointmentStatus, Doctor } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS, STATUS_LABELS } from '../../datapoints/scheduling';
import type { Vitals, ClinicalVisit, EcogScore } from '../../datapoints/clinical';
import { ECOG_LABELS, ECOG_COLORS } from '../../datapoints/clinical';
import { Modal, ModalBody, ModalFooter } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { IconButton } from '../../components/controls/IconButton';

interface Props {
  appointment:   Appointment;
  clinicalVisit: ClinicalVisit | null;
  vitals:        Vitals | null;
  doctor:        Doctor | null;
  onClose:       () => void;
}

const STATUS_BADGE: Partial<Record<AppointmentStatus, string>> = {
  scheduled:            'bg-muted text-muted-foreground',
  confirmed:            'bg-blue-100 text-blue-700',
  'checked-in':         'bg-primary/10 text-primary',
  'in-progress':        'bg-amber-100 text-amber-700',
  completed:            'bg-green-100 text-green-700',
  cancelled:            'bg-destructive/10 text-destructive',
  'vitals-recorded':    'bg-teal-100 text-teal-700',
  'checklist-completed':'bg-purple-100 text-purple-700',
  'chair-assigned':     'bg-indigo-100 text-indigo-700',
};

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 rounded-xl px-5 py-4">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">{title}</p>
      {children}
    </div>
  );
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
}

export function PastVisitDetailOverlay({ appointment, clinicalVisit, vitals, doctor, onClose }: Props) {
  const ecog = clinicalVisit?.ecogScore;

  return (
    <Modal onClose={onClose} size="2xl" className="max-h-[88vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <p className="text-sm font-semibold text-foreground font-mono">{appointment.visitId}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              {doctor ? ` · ${doctor.name}` : ''}
            </p>
          </div>
          <IconButton icon={<X size={18} />} label="Close" onClick={onClose} />
        </div>

        {/* Scrollable body */}
        <ModalBody className="space-y-4">

          {/* Appointment Info */}
          <SectionBlock title="Appointment">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {[
                { label: 'Date',   value: new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                { label: 'Time',   value: formatTime(appointment.time) },
                { label: 'Center', value: appointment.center },
                { label: 'Doctor', value: doctor?.name ?? '—' },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-14 shrink-0">{r.label}</span>
                  <span className="text-foreground font-medium">{r.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-14 shrink-0">Type</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {APPOINTMENT_TYPE_LABELS[appointment.type]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-14 shrink-0">Status</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[appointment.status] ?? 'bg-muted text-muted-foreground'}`}>
                  {STATUS_LABELS[appointment.status]}
                </span>
              </div>
            </div>
          </SectionBlock>

          {clinicalVisit ? (
            <>
              {/* Chief Complaints */}
              {clinicalVisit.chiefComplaints && (
                <SectionBlock title="Chief Complaints">
                  <p className="text-sm text-foreground leading-relaxed">{clinicalVisit.chiefComplaints}</p>
                </SectionBlock>
              )}

              {/* ECOG */}
              {ecog !== undefined && (
                <SectionBlock title="ECOG Performance Status">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${ECOG_COLORS[ecog as EcogScore]}`}>
                      {ecog}
                    </span>
                    <span className="text-sm text-foreground">{ECOG_LABELS[ecog as EcogScore]}</span>
                  </div>
                </SectionBlock>
              )}

              {/* Vitals */}
              {vitals ? (
                <SectionBlock title="Vitals">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                      { label: 'BP',   value: vitals.bp,                   unit: 'mmHg' },
                      { label: 'HR',   value: String(vitals.heartRate),     unit: 'bpm'  },
                      { label: 'Temp', value: String(vitals.temperature),   unit: '°F'   },
                      { label: 'BMI',  value: String(vitals.bmi),           unit: ''     },
                      { label: 'BSA',  value: String(vitals.bsa),           unit: 'm²'   },
                      { label: 'SpO₂', value: String(vitals.spo2),          unit: '%'    },
                    ].map(m => (
                      <div key={m.label} className="bg-background border border-border rounded-lg px-3 py-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{m.label}</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">{m.value}<span className="text-[10px] font-normal ml-0.5">{m.unit}</span></p>
                      </div>
                    ))}
                  </div>
                </SectionBlock>
              ) : (
                <SectionBlock title="Vitals">
                  <p className="text-sm text-muted-foreground italic">No vitals recorded for this visit.</p>
                </SectionBlock>
              )}

              {/* Clinical Notes */}
              {clinicalVisit.clinicalNotes && (
                <SectionBlock title="Clinical Notes">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{clinicalVisit.clinicalNotes}</p>
                </SectionBlock>
              )}

              {/* Plan */}
              {clinicalVisit.plan && (
                <SectionBlock title="Plan / Next Steps">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{clinicalVisit.plan}</p>
                </SectionBlock>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">No clinical data recorded for this visit.</p>
              <p className="text-xs text-muted-foreground mt-1">Clinical notes will be added when the visit is completed.</p>
            </div>
          )}
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
