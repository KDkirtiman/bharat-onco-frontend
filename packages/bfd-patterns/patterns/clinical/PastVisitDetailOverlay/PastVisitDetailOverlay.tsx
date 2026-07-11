import * as styles from './PastVisitDetailOverlay.styles';
import { X } from 'bfd-icons';
import type { Appointment, AppointmentStatus, Doctor } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, STATUS_LABELS } from 'bfd-core';
import type { Vitals, ClinicalVisit, EcogScore } from 'bfd-core';
import { ECOG_LABELS, ECOG_COLORS } from 'bfd-core';
import { Modal, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { IconButton } from 'bfd-core';

interface Props {
  appointment:   Appointment;
  clinicalVisit: ClinicalVisit | null;
  vitals:        Vitals | null;
  doctor:        Doctor | null;
  onClose:       () => void;
}

const STATUS_BADGE: Partial<Record<AppointmentStatus, string>> = {
  scheduled:            'bg-muted text-muted-foreground',
  confirmed:            'bg-info-soft text-info-emphasis',
  'checked-in':         'bg-primary/10 text-primary',
  'in-progress':        'bg-warning-soft text-warning-emphasis',
  completed:            'bg-success-soft text-success-emphasis',
  cancelled:            'bg-destructive/10 text-destructive',
  'vitals-recorded':    'bg-teal-soft text-teal-emphasis',
  'checklist-completed':'bg-purple-soft text-purple-emphasis',
  'chair-assigned':     'bg-indigo-soft text-indigo-emphasis',
};

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.style1}>
      <p className={styles.style2}>{title}</p>
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
    <Modal onClose={onClose} size="2xl" className={styles.style3}>

        {/* Header */}
        <div className={styles.style4}>
          <div>
            <p className={styles.style5}>{appointment.visitId}</p>
            <p className={styles.style6}>
              {new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              {doctor ? ` · ${doctor.name}` : ''}
            </p>
          </div>
          <IconButton icon={<X size={18} />} label="Close" onClick={onClose} />
        </div>

        {/* Scrollable body */}
        <ModalBody className={styles.style7}>

          {/* Appointment Info */}
          <SectionBlock title="Appointment">
            <div className={styles.style8}>
              {[
                { label: 'Date',   value: new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                { label: 'Time',   value: formatTime(appointment.time) },
                { label: 'Center', value: appointment.center },
                { label: 'Doctor', value: doctor?.name ?? '—' },
              ].map(r => (
                <div key={r.label} className={styles.style9}>
                  <span className={styles.style10}>{r.label}</span>
                  <span className={styles.style11}>{r.value}</span>
                </div>
              ))}
              <div className={styles.style9}>
                <span className={styles.style10}>Type</span>
                <span className={styles.style12}>
                  {APPOINTMENT_TYPE_LABELS[appointment.type]}
                </span>
              </div>
              <div className={styles.style9}>
                <span className={styles.style10}>Status</span>
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
                  <p className={styles.style13}>{clinicalVisit.chiefComplaints}</p>
                </SectionBlock>
              )}

              {/* ECOG */}
              {ecog !== undefined && (
                <SectionBlock title="ECOG Performance Status">
                  <div className={styles.style9}>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${ECOG_COLORS[ecog as EcogScore]}`}>
                      {ecog}
                    </span>
                    <span className={styles.style14}>{ECOG_LABELS[ecog as EcogScore]}</span>
                  </div>
                </SectionBlock>
              )}

              {/* Vitals */}
              {vitals ? (
                <SectionBlock title="Vitals">
                  <div className={styles.style15}>
                    {[
                      { label: 'BP',   value: vitals.bp,                   unit: 'mmHg' },
                      { label: 'HR',   value: String(vitals.heartRate),     unit: 'bpm'  },
                      { label: 'Temp', value: String(vitals.temperature),   unit: '°F'   },
                      { label: 'BMI',  value: String(vitals.bmi),           unit: ''     },
                      { label: 'BSA',  value: String(vitals.bsa),           unit: 'm²'   },
                      { label: 'SpO₂', value: String(vitals.spo2),          unit: '%'    },
                    ].map(m => (
                      <div key={m.label} className={styles.style16}>
                        <p className={styles.style17}>{m.label}</p>
                        <p className={styles.style18}>{m.value}<span className={styles.style19}>{m.unit}</span></p>
                      </div>
                    ))}
                  </div>
                </SectionBlock>
              ) : (
                <SectionBlock title="Vitals">
                  <p className={styles.style20}>No vitals recorded for this visit.</p>
                </SectionBlock>
              )}

              {/* Clinical Notes */}
              {clinicalVisit.clinicalNotes && (
                <SectionBlock title="Clinical Notes">
                  <p className={styles.style21}>{clinicalVisit.clinicalNotes}</p>
                </SectionBlock>
              )}

              {/* Plan */}
              {clinicalVisit.plan && (
                <SectionBlock title="Plan / Next Steps">
                  <p className={styles.style21}>{clinicalVisit.plan}</p>
                </SectionBlock>
              )}
            </>
          ) : (
            <div className={styles.style22}>
              <p className={styles.style23}>No clinical data recorded for this visit.</p>
              <p className={styles.style24}>Clinical notes will be added when the visit is completed.</p>
            </div>
          )}
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          <Button variant="ghost" size="sm" className={styles.style25} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
    </Modal>
  );
}
