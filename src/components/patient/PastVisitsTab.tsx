import { useState } from 'react';
import { Calendar, Eye } from 'lucide-react';
import type { Appointment, AppointmentStatus, Doctor } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS, STATUS_LABELS } from '../../datapoints/scheduling';
import type { Vitals, ClinicalVisit } from '../../datapoints/clinical';
import { ECOG_COLORS, ECOG_LABELS } from '../../datapoints/clinical';
import { PastVisitDetailOverlay } from '../../patterns/clinical/PastVisitDetailOverlay';

interface Props {
  appointments:   Appointment[];
  vitals:         Vitals[];
  clinicalVisits: ClinicalVisit[];
  doctors:        Doctor[];
}

const STATUS_COLORS: Partial<Record<AppointmentStatus, string>> = {
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Calendar size={36} className="text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No past visits</p>
        <p className="text-xs text-muted-foreground mt-1">Appointment history will appear here once visits are recorded.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {sorted.map(appt => {
          const cv     = clinicalVisits.find(c => c.appointmentId === appt.id);
          const vtls   = cv?.vitalsId ? vitals.find(v => v.id === cv.vitalsId) : null;
          const doctor = doctors.find(d => d.id === appt.doctorId);

          return (
            <div key={appt.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              {/* ── Card header ── */}
              <div className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{appt.visitId}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {APPOINTMENT_TYPE_LABELS[appt.type]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[appt.status] ?? 'bg-muted text-muted-foreground'}`}>
                      {STATUS_LABELS[appt.status]}
                    </span>
                  </div>
                  {doctor && (
                    <p className="text-xs text-muted-foreground mt-1">{doctor.name} · {appt.center}</p>
                  )}
                </div>
                <button
                  onClick={() => setDetailApptId(appt.id)}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors shrink-0"
                >
                  <Eye size={13} />
                  View Details
                </button>
              </div>

              {/* ── Card content ── */}
              <div className="px-5 pb-4 pt-3 border-t border-border space-y-2.5">
                {cv ? (
                  <>
                    {/* Chief complaints */}
                    {cv.chiefComplaints && (
                      <p className="text-sm text-foreground line-clamp-2 leading-relaxed">{cv.chiefComplaints}</p>
                    )}

                    {/* ECOG + Vitals row */}
                    <div className="flex flex-wrap items-center gap-2">
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
                            <span key={m.label} className="bg-muted/60 rounded-lg px-2.5 py-1 text-xs">
                              <span className="text-muted-foreground">{m.label}: </span>
                              <span className="text-foreground font-medium">{m.value}</span>
                            </span>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Clinical notes preview */}
                    {cv.clinicalNotes && (
                      <p className="text-xs text-muted-foreground italic line-clamp-1">{cv.clinicalNotes}</p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No clinical data recorded for this visit.</p>
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
