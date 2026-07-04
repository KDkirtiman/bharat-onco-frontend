import { useState } from 'react';
import { X, Clock, Layers, FlaskConical, FileText, AlertOctagon } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { Patient } from '../../datapoints/patients';
import type { Appointment } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS } from '../../datapoints/scheduling';
import type { ClinicalVisit } from '../../datapoints/clinical';
import type { TreatmentPlan, TreatmentDelivery, ToxicityRecord } from '../../datapoints/treatment';
import {
  TREATMENT_STATUS_COLORS, DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS,
  CTCAE_CATEGORY_LABELS, CTCAE_GRADE_DESCRIPTIONS,
} from '../../datapoints/treatment';
import type { CancerStaging } from '../../datapoints/staging';

type PanelTab = 'visits' | 'plans' | 'cycles' | 'documents' | 'toxicity';

interface Props {
  patient:             Patient;
  appointments:        Appointment[];
  clinicalVisits:      ClinicalVisit[];
  treatmentPlans:      TreatmentPlan[];
  treatmentDelivery:   TreatmentDelivery[];
  toxicityRecords:     ToxicityRecord[];
  stagingRecords:      CancerStaging[];
  currentAppointmentId: string;
  onClose:             () => void;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const GRADE_COLORS: Record<number, string> = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-amber-100 text-amber-700',
  3: 'bg-orange-100 text-orange-700',
  4: 'bg-destructive/10 text-destructive',
  5: 'bg-red-900 text-white',
};

export function OncologistReferencePanel({
  patient, appointments, clinicalVisits, treatmentPlans,
  treatmentDelivery, toxicityRecords, stagingRecords,
  currentAppointmentId, onClose,
}: Props) {
  const pastVisits = clinicalVisits
    .filter(cv => cv.patientId === patient.id && cv.appointmentId !== currentAppointmentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const patientPlans     = treatmentPlans.filter(p => p.patientId === patient.id);
  const patientDeliveries = treatmentDelivery.filter(d => d.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const patientToxicity  = toxicityRecords.filter(r => r.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const docs             = patient.uploadedDocuments ?? [];

  const availableTabs = ([
    { id: 'visits' as const,    label: 'Past Visits',  icon: <Clock size={12} />,        count: pastVisits.length    },
    { id: 'plans' as const,     label: 'Tx Plans',     icon: <Layers size={12} />,       count: patientPlans.length  },
    { id: 'cycles' as const,    label: 'Cycles',       icon: <FlaskConical size={12} />, count: patientDeliveries.length },
    { id: 'documents' as const, label: 'Documents',    icon: <FileText size={12} />,     count: docs.length          },
    { id: 'toxicity' as const,  label: 'Toxicity',     icon: <AlertOctagon size={12} />, count: patientToxicity.length },
  ] as const).filter(t => t.count > 0);

  const [activeTab, setActiveTab] = useState<PanelTab>(availableTabs[0]?.id ?? 'visits');

  if (availableTabs.length === 0) return null;

  function getAppt(appointmentId: string) {
    return appointments.find(a => a.id === appointmentId);
  }

  return (
    <div className="fixed top-16 right-0 bottom-0 w-[420px] z-30 bg-card border-l border-border flex flex-col overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Patient History</p>
        <button
          onClick={onClose}
          className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body: vertical tab list + content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Vertical tab list */}
        <div className="flex flex-col border-r border-border shrink-0 w-28 overflow-y-auto">
          {availableTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-3 text-[11px] font-medium transition-colors text-left border-l-2',
                activeTab === tab.id
                  ? 'text-primary border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50',
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

        {/* Past Visits */}
        {activeTab === 'visits' && (
          <div className="divide-y divide-border">
            {pastVisits.map(cv => {
              const appt = getAppt(cv.appointmentId);
              return (
                <div key={cv.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">
                      {appt ? fmtDate(appt.date) : fmtDate(cv.createdAt)}
                    </span>
                    {appt && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {APPOINTMENT_TYPE_LABELS[appt.type]}
                      </span>
                    )}
                  </div>
                  {cv.chiefComplaints && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      <span className="font-medium text-foreground">CC: </span>
                      {cv.chiefComplaints}
                    </p>
                  )}
                  {cv.clinicalNotes && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cv.clinicalNotes}
                    </p>
                  )}
                  {cv.prescriptions && cv.prescriptions.length > 0 && (
                    <p className="text-[10px] text-muted-foreground/70">
                      {cv.prescriptions.length} prescription{cv.prescriptions.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Treatment Plans */}
        {activeTab === 'plans' && (
          <div className="divide-y divide-border">
            {patientPlans.map(plan => (
              <div key={plan.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground truncate">{plan.regimen}</p>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0', TREATMENT_STATUS_COLORS[plan.status])}>
                    {plan.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                    {plan.modality}
                  </span>
                  {plan.intent && (
                    <span className="text-[10px] text-muted-foreground">{plan.intent}</span>
                  )}
                </div>
                {plan.modality === 'chemotherapy' && plan.chemoDetails && (
                  <p className="text-[10px] text-muted-foreground">
                    {plan.chemoDetails.drugs.map(d => d.name).join(', ')}
                    {' · '}{plan.chemoDetails.cyclesPlanned} cycles
                  </p>
                )}
                {plan.startDate && (
                  <p className="text-[10px] text-muted-foreground/70">
                    Started: {fmtDate(plan.startDate)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Treatment Cycles */}
        {activeTab === 'cycles' && (
          <div className="divide-y divide-border">
            {patientDeliveries.map(d => {
              const plan = patientPlans.find(p => p.id === d.planId);
              const cycleNum = d.chemoDetails?.cycleNumber ?? d.sessionNumber;
              return (
                <div key={d.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground capitalize">
                        {d.modality}
                        {cycleNum ? ` · Cycle ${cycleNum}` : ''}
                      </span>
                    </div>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0', DELIVERY_STATUS_COLORS[d.status])}>
                      {DELIVERY_STATUS_LABELS[d.status]}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{fmtDate(d.date)}</p>
                  {plan && (
                    <p className="text-[10px] text-muted-foreground/70 truncate">{plan.regimen}</p>
                  )}
                  {d.chemoDetails?.drugs && (
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {d.chemoDetails.drugs.map(dr => dr.name).join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && (
          <div className="divide-y divide-border">
            {docs.map((doc, i) => (
              <div key={i} className="px-4 py-3 space-y-0.5">
                <p className="text-xs font-medium text-foreground truncate">{doc.fileName}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {doc.type}
                  </span>
                  {doc.subcategory && (
                    <span className="text-[10px] text-muted-foreground">{doc.subcategory}</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground/70">{fmtDate(doc.uploadedAt)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toxicity */}
        {activeTab === 'toxicity' && (
          <div className="divide-y divide-border">
            {patientToxicity.map(rec => {
              const plan = patientPlans.find(p => p.id === rec.planId);
              return (
                <div key={rec.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">{rec.toxicityType}</p>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0', GRADE_COLORS[rec.grade] ?? 'bg-muted text-muted-foreground')}>
                      G{rec.grade}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      {CTCAE_CATEGORY_LABELS[rec.ctcaeCategory]}
                    </span>
                    {plan && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {plan.modality}{rec.cycleNumber ? ` C${rec.cycleNumber}` : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground/70">{fmtDate(rec.date)}</p>
                  {rec.description && (
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{rec.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
