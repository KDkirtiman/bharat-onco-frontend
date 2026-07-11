import * as styles from './PastVisitsTab.styles';
import { useState } from 'react';
import { Calendar, Eye } from 'bfd-icons';
import type { Appointment, AppointmentStatus, Doctor } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, STATUS_LABELS } from 'bfd-core';
import type { Vitals, ClinicalVisit } from 'bfd-core';
import { ECOG_COLORS, ECOG_LABELS } from 'bfd-core';
import { PastVisitDetailOverlay } from '../../patterns/clinical/PastVisitDetailOverlay';

interface Props {
  appointments:   Appointment[];
  vitals:         Vitals[];
  clinicalVisits: ClinicalVisit[];
  doctors:        Doctor[];
}

const STATUS_COLORS: Partial<Record<AppointmentStatus, string>> = {
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

export function PastVisitsTab({ appointments, vitals, clinicalVisits, doctors }: Props) {
  const [detailApptId, setDetailApptId] = useState<string | null>(null);

  const sorted = [...appointments].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.time.localeCompare(a.time);
  });

  const detailAppt = detailApptId ? appointments.find(a => a.id === detailApptId) : null;
  const detailVisit = detailAppt ? clinicalVisits.find(cv => cv.appointmentId === detailAppt.id) : null;
  const detailVitals = detailVisit?.vitalsId ? vitals.find(v => v.id === detailVisit.vitalsId) : null;
  const detailDoctor = detailAppt ? doctors.find(d => d.id === detailAppt.doctorId) : null;

  if (sorted.length === 0) {
    return (
      <div className={styles.style1}>
        <Calendar size={36} className={styles.style2} />
        <p className={styles.style3}>No past visits</p>
        <p className={styles.style4}>Appointment history will appear here once visits are recorded.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.style5}>
        {sorted.map(appt => {
          const cv     = clinicalVisits.find(c => c.appointmentId === appt.id);
          const vtls   = cv?.vitalsId ? vitals.find(v => v.id === cv.vitalsId) : null;
          const doctor = doctors.find(d => d.id === appt.doctorId);

          return (
            <div key={appt.id} className={styles.style6}>
              {/* ── Card header ── */}
              <div className={styles.style7}>
                <div className={styles.style8}>
                  <div className={styles.style9}>
                    <span className={styles.style10}>
                      {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={styles.style11}>{appt.visitId}</span>
                    <span className={styles.style12}>
                      {APPOINTMENT_TYPE_LABELS[appt.type]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[appt.status] ?? 'bg-muted text-muted-foreground'}`}>
                      {STATUS_LABELS[appt.status]}
                    </span>
                  </div>
                  {doctor && (
                    <p className={styles.style4}>{doctor.name} · {appt.center}</p>
                  )}
                </div>
                <button
                  onClick={() => setDetailApptId(appt.id)}
                  className={styles.style13}
                >
                  <Eye size={13} />
                  View Details
                </button>
              </div>

              {/* ── Card content ── */}
              <div className={styles.style14}>
                {cv ? (
                  <>
                    {/* Chief complaints */}
                    {cv.chiefComplaints && (
                      <p className={styles.style15}>{cv.chiefComplaints}</p>
                    )}

                    {/* ECOG + Vitals row */}
                    <div className={styles.style9}>
                      {cv.ecogScore !== undefined && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ECOG_COLORS[cv.ecogScore]}`}>
                          ECOG {cv.ecogScore}
                        </span>
                      )}
                      {vtls && (
                        <>
                          {[
                            { label: 'BP',    value: vtls.bp },
                            { label: 'HR',    value: `${vtls.heartRate} bpm` },
                            { label: 'Temp',  value: `${vtls.temperature}°F` },
                            { label: 'BMI',   value: String(vtls.bmi) },
                            { label: 'BSA',   value: `${vtls.bsa} m²` },
                            { label: 'SpO₂',  value: `${vtls.spo2}%` },
                          ].map(m => (
                            <span key={m.label} className={styles.style16}>
                              <span className={styles.style17}>{m.label}: </span>
                              <span className={styles.style18}>{m.value}</span>
                            </span>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Clinical notes preview */}
                    {cv.clinicalNotes && (
                      <p className={styles.style19}>{cv.clinicalNotes}</p>
                    )}
                  </>
                ) : (
                  <p className={styles.style20}>No clinical data recorded for this visit.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {detailAppt && (
        <PastVisitDetailOverlay
          appointment={detailAppt}
          clinicalVisit={detailVisit ?? null}
          vitals={detailVitals ?? null}
          doctor={detailDoctor ?? null}
          onClose={() => setDetailApptId(null)}
        />
      )}
    </>
  );
}
